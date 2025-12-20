// generate 256-bit AES key
export async function generateConversationKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

// Export CryptoKey to raw bytes
export async function exportRawKey(key: CryptoKey): Promise<Uint8Array> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return new Uint8Array(raw);
}

// Helper: Ensure proper ArrayBuffer (not SharedArrayBuffer)
function ensureArrayBuffer(
  source: ArrayBuffer | SharedArrayBuffer
): ArrayBuffer {
  if (source instanceof ArrayBuffer) {
    return source;
  }
  // Convert SharedArrayBuffer to ArrayBuffer
  const buffer = new ArrayBuffer(source.byteLength);
  new Uint8Array(buffer).set(new Uint8Array(source));
  return buffer;
}

// Helper: Uint8Array to proper ArrayBuffer
function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  // Create a new ArrayBuffer and copy data
  const buffer = new ArrayBuffer(u8.byteLength);
  new Uint8Array(buffer).set(u8);
  return buffer;
}

// Helper: decode base64 to proper ArrayBuffer
function b64ToArrayBuffer(b64: string): ArrayBuffer {
  try {
    const binary = atob(b64);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return buffer;
  } catch (err) {
    throw new Error(`Invalid base64: ${err}`);
  }
}

// Encrypt conversation key for a recipient using ECDH + AES-GCM
export async function encryptConversationKey(
  rawConversationKey: Uint8Array,
  recipientPublicKey: CryptoKey
): Promise<{
  cipher: string;
  iv: string;
  eph_public_key: string;
}> {
  // 1. Generate ephemeral key pair
  const ephKey = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"]
  );

  // 2. Derive shared secret with recipient's public key
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

  // 3. Generate IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Convert Uint8Array to proper ArrayBuffer
  const keyBuffer = toArrayBuffer(rawConversationKey);
  const ivBuffer = toArrayBuffer(iv);

  // 4. Encrypt
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: ivBuffer, tagLength: 128 },
    sharedKey,
    keyBuffer
  );

  // 5. Export ephemeral public key
  const ephPubRaw = await crypto.subtle.exportKey("raw", ephKey.publicKey);

  // 6. Return as base64
  return {
    cipher: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
    iv: btoa(String.fromCharCode(...iv)),
    eph_public_key: btoa(String.fromCharCode(...new Uint8Array(ephPubRaw))),
  };
}

// Decrypt conversation key using recipient's private key
export async function decryptConversationKey(params: {
  cipher: string; // base64
  iv: string; // base64 (12 bytes)
  eph_public_key: string; // base64 (raw uncompressed P-256)
  recipientPrivateKey: CryptoKey; // ECDH private key
}): Promise<string> {
  const { cipher, iv, eph_public_key, recipientPrivateKey } = params;

  // 1. Decode components to proper ArrayBuffer
  const ephPubRaw = b64ToArrayBuffer(eph_public_key);
  const ivBytes = b64ToArrayBuffer(iv);
  const cipherBytes = b64ToArrayBuffer(cipher);

  // Validate sizes
  if (ephPubRaw.byteLength !== 65) {
    throw new Error(
      `Invalid ephemeral public key size: expected 65 bytes, got ${ephPubRaw.byteLength}`
    );
  }
  if (ivBytes.byteLength !== 12) {
    throw new Error(
      `Invalid IV size: expected 12 bytes, got ${ivBytes.byteLength}`
    );
  }

  // 2. Import ephemeral public key
  const ephPubKey = await crypto.subtle.importKey(
    "raw",
    ephPubRaw,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );

  // 3. Derive same shared AES key
  const aesKey = await crypto.subtle.deriveKey(
    { name: "ECDH", public: ephPubKey },
    recipientPrivateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  // 4. Decrypt to raw conversation key bytes
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes, tagLength: 128 },
    aesKey,
    cipherBytes
  );

  // 5. Return as base64 for reuse
  const raw = new Uint8Array(plain);
  return btoa(String.fromCharCode(...raw));
}
