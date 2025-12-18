export async function encryptMessage(plaintext: string, base64Key: string) {
  const enc = new TextEncoder();
  const keyBytes = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, [
    "encrypt",
  ]);

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
  const keyBytes = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, [
    "decrypt",
  ]);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: Uint8Array.from(atob(nonce), (c) => c.charCodeAt(0)),
    },
    key,
    Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0))
  );

  return new TextDecoder().decode(decrypted);
}
