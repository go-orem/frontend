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

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    sharedKey,
    rawConversationKey.buffer as ArrayBuffer // 🔥 FIX DI SINI
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
