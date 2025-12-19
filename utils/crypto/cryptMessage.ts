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

  // ✅ FIX: Extract GCM tag (last 16 bytes)
  const encryptedBytes = new Uint8Array(encrypted);
  const cipherBytes = encryptedBytes.slice(0, encryptedBytes.length - 16);
  const tagBytes = encryptedBytes.slice(encryptedBytes.length - 16);

  return {
    cipher_text: btoa(String.fromCharCode(...cipherBytes)),
    nonce: btoa(String.fromCharCode(...nonce)),
    tag: btoa(String.fromCharCode(...tagBytes)), // ✅ Extract & encode tag
    encryption_algo: "AES-256-GCM",
  };
}

export async function decryptMessage(
  cipherText: string,
  nonce: string,
  base64Key: string,
  tag: string // ✅ Accept tag parameter
) {
  // ✅ Validation
  if (!cipherText || !nonce || !base64Key || !tag) {
    throw new Error(
      "All parameters (cipherText, nonce, base64Key, tag) are required"
    );
  }

  let keyBytes: Uint8Array;
  let cipherBytes: Uint8Array;
  let nonceBytes: Uint8Array;
  let tagBytes: Uint8Array;

  try {
    keyBytes = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
    cipherBytes = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));
    nonceBytes = Uint8Array.from(atob(nonce), (c) => c.charCodeAt(0));
    tagBytes = Uint8Array.from(atob(tag), (c) => c.charCodeAt(0)); // ✅ Decode tag
  } catch (err) {
    throw new Error("Invalid base64 format in cipherText, nonce, key, or tag");
  }

  // ✅ FIX: Convert all Uint8Array to proper ArrayBuffer
  const keyBuffer = new ArrayBuffer(keyBytes.length);
  new Uint8Array(keyBuffer).set(keyBytes);

  const nonceBuffer = new ArrayBuffer(nonceBytes.length);
  new Uint8Array(nonceBuffer).set(nonceBytes);

  // ✅ Combine cipherBytes + tagBytes untuk decrypt
  const combinedBuffer = new ArrayBuffer(cipherBytes.length + tagBytes.length);
  const combined = new Uint8Array(combinedBuffer);
  combined.set(cipherBytes, 0);
  combined.set(tagBytes, cipherBytes.length);

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
    combinedBuffer // ✅ Cipher + tag combined
  );

  return new TextDecoder().decode(decrypted);
}
