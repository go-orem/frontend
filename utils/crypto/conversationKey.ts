// generate 256-bit AES key
export async function generateConversationKey() {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

export async function exportRawKey(key: CryptoKey) {
  const raw = await crypto.subtle.exportKey("raw", key);
  return new Uint8Array(raw);
}

export async function encryptConversationKey(
  rawConversationKey: Uint8Array,
  recipientPublicKey: CryptoKey
) {
  // 1. ephemeral key
  const ephKey = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"]
  );

  // 2. shared secret
  const sharedKey = await crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: recipientPublicKey,
    },
    ephKey.privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // 3. encrypt
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // ✅ FIX: Convert Uint8Array to proper ArrayBuffer
  const keyBuffer = new ArrayBuffer(rawConversationKey.length);
  new Uint8Array(keyBuffer).set(rawConversationKey);

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    sharedKey,
    keyBuffer
  );

  return {
    cipher: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
    iv: btoa(String.fromCharCode(...iv)),
    eph_public_key: btoa(
      String.fromCharCode(
        ...new Uint8Array(
          await crypto.subtle.exportKey("raw", ephKey.publicKey)
        )
      )
    ),
  };
}

// Decrypt conversation key encrypted with encryptConversationKey()
export async function decryptConversationKey(params: {
  cipher: string; // base64
  iv: string; // base64 (12 bytes)
  eph_public_key: string; // base64 (raw uncompressed P-256)
  recipientPrivateKey: CryptoKey; // ECDH private key
}): Promise<string> {
  const { cipher, iv, eph_public_key, recipientPrivateKey } = params;

  // Decode base64 helpers
  const b64ToBytes = (b64: string) =>
    Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

  const ephPubRaw = b64ToBytes(eph_public_key);
  const ephPubBuf = new ArrayBuffer(ephPubRaw.length);
  new Uint8Array(ephPubBuf).set(ephPubRaw);

  // Import ephemeral public key
  const ephPubKey = await crypto.subtle.importKey(
    "raw",
    ephPubBuf,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );

  // Derive same shared AES key as encryptor
  const aesKey = await crypto.subtle.deriveKey(
    { name: "ECDH", public: ephPubKey },
    recipientPrivateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const ivBytes = b64ToBytes(iv);
  const cipherBytes = b64ToBytes(cipher);

  const ivBuf = new ArrayBuffer(ivBytes.length);
  new Uint8Array(ivBuf).set(ivBytes);

  const cipherBuf = new ArrayBuffer(cipherBytes.length);
  new Uint8Array(cipherBuf).set(cipherBytes);

  // Decrypt to raw conversation key bytes
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuf },
    aesKey,
    cipherBuf
  );

  const raw = new Uint8Array(plain);
  // Return base64 conversation key for reuse with encrypt/decryptMessage()
  return btoa(String.fromCharCode(...raw));
}
