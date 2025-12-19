export async function encryptMessage(plaintext: string, base64Key: string) {
  // ✅ Validation
  if (!plaintext) throw new Error("Plaintext cannot be empty");
  if (!base64Key) throw new Error("Base64 key is required");

  const enc = new TextEncoder();

  // ✅ Safe decode with error handling
  let keyBytes: Uint8Array;
  try {
    keyBytes = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
  } catch (err) {
    throw new Error("Invalid base64 key format");
  }

  // ✅ FIX: Convert Uint8Array to proper ArrayBuffer
  const keyBuffer = new ArrayBuffer(keyBytes.length);
  new Uint8Array(keyBuffer).set(keyBytes);

  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    "AES-GCM",
    false,
    ["encrypt"]
  );

  const nonce = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce,
    },
    key,
    enc.encode(plaintext)
  );

  return {
    cipher_text: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    nonce: btoa(String.fromCharCode(...nonce)),
    tag: null, // GCM tag sudah include di cipher
    encryption_algo: "AES-256-GCM",
  };
}

export async function decryptMessage(
  cipherText: string,
  nonce: string,
  base64Key: string
) {
  // ✅ Validation
  if (!cipherText || !nonce || !base64Key) {
    throw new Error(
      "All parameters (cipherText, nonce, base64Key) are required"
    );
  }

  let keyBytes: Uint8Array;
  let cipherBytes: Uint8Array;
  let nonceBytes: Uint8Array;

  try {
    keyBytes = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
    cipherBytes = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));
    nonceBytes = Uint8Array.from(atob(nonce), (c) => c.charCodeAt(0));
  } catch (err) {
    throw new Error("Invalid base64 format in cipherText, nonce, or key");
  }

  // ✅ FIX: Convert all Uint8Array to proper ArrayBuffer
  const keyBuffer = new ArrayBuffer(keyBytes.length);
  new Uint8Array(keyBuffer).set(keyBytes);

  const nonceBuffer = new ArrayBuffer(nonceBytes.length);
  new Uint8Array(nonceBuffer).set(nonceBytes);

  const cipherBuffer = new ArrayBuffer(cipherBytes.length);
  new Uint8Array(cipherBuffer).set(cipherBytes);

  // ✅ FIX: Import key using keyBuffer (ArrayBuffer)
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    "AES-GCM",
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: nonceBuffer,
    },
    key, // ✅ Use CryptoKey
    cipherBuffer
  );

  return new TextDecoder().decode(decrypted);
}
