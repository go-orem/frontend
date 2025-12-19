import { UIMessage } from "@/types/chat.types";

export async function encryptMessage(plaintext: string, base64Key: string) {
  if (!plaintext) throw new Error("Plaintext cannot be empty");
  if (!base64Key) throw new Error("Base64 key is required");

  const enc = new TextEncoder();

  let keyBytes: Uint8Array;
  try {
    keyBytes = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
  } catch (err) {
    throw new Error("Invalid base64 key format");
  }

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

  const encryptedBytes = new Uint8Array(encrypted);
  const cipherBytes = encryptedBytes.slice(0, encryptedBytes.length - 16);
  const tagBytes = encryptedBytes.slice(encryptedBytes.length - 16);

  return {
    cipher_text: btoa(String.fromCharCode(...cipherBytes)),
    nonce: btoa(String.fromCharCode(...nonce)),
    tag: btoa(String.fromCharCode(...tagBytes)),
    encryption_algo: "AES-256-GCM",
  };
}

export async function decryptMessage(
  cipherText: string,
  nonce: string,
  base64Key: string,
  tag: string
) {
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
    tagBytes = Uint8Array.from(atob(tag), (c) => c.charCodeAt(0));
  } catch (err) {
    console.log("Base64 decode error:", err);
    throw new Error("Invalid base64 format");
  }

  console.log("🔍 Decrypt sizes:", {
    keySize: keyBytes.length,
    cipherSize: cipherBytes.length,
    nonceSize: nonceBytes.length,
    tagSize: tagBytes.length,
  });

  const keyBuffer = new ArrayBuffer(keyBytes.length);
  new Uint8Array(keyBuffer).set(keyBytes);

  const nonceBuffer = new ArrayBuffer(nonceBytes.length);
  new Uint8Array(nonceBuffer).set(nonceBytes);

  const combinedSize = cipherBytes.length + tagBytes.length;
  const combinedBuffer = new ArrayBuffer(combinedSize);
  const combined = new Uint8Array(combinedBuffer);
  combined.set(cipherBytes, 0);
  combined.set(tagBytes, cipherBytes.length);

  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    "AES-GCM",
    false,
    ["decrypt"]
  );

  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: nonceBuffer,
        tagLength: 128,
      },
      key,
      combinedBuffer
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.log("❌ Decrypt failed:", {
      error: err,
      cipherLen: cipherBytes.length,
      tagLen: tagBytes.length,
    });
    throw new Error("Decryption failed");
  }
}

// Helper: check if a string looks like base64 (len%4==0 and charset valid)
function looksLikeBase64(str: string) {
  if (!str || typeof str !== "string") return false;
  if (str.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/]+={0,2}$/.test(str);
}

// Helper: normalize incoming field (string | number[]) into base64 string
// ✅ SIMPLIFIED: Backend now returns base64 strings directly
function normalizeEncComponent(
  comp: string | number[] | null | undefined
): string | null {
  if (!comp) return null;

  // If already string, use directly (backend now returns base64)
  if (typeof comp === "string") return comp;

  // Legacy fallback: convert number[] to string
  // Check if it looks like ASCII bytes of a base64 string
  if (Array.isArray(comp)) {
    try {
      const str = String.fromCharCode(...comp);
      // Validate it's valid base64
      atob(str);
      return str;
    } catch {
      // Not valid base64, try raw encode
      try {
        return btoa(String.fromCharCode(...comp));
      } catch {
        return null;
      }
    }
  }

  return null;
}

export async function decryptUIMessage(
  message: UIMessage,
  conversationKey: string
): Promise<string> {
  try {
    const cipherText = normalizeEncComponent(message.cipher_text);
    const nonce = normalizeEncComponent(message.nonce);
    const tag = normalizeEncComponent(message.tag);

    if (!cipherText) return "[Missing cipher]";
    if (!nonce) return "[Missing nonce]";
    if (!tag) return "[Missing tag]";

    return await decryptMessage(cipherText, nonce, conversationKey, tag);
  } catch (err) {
    console.log("Decrypt error:", err);
    return "[Decryption failed]";
  }
}
