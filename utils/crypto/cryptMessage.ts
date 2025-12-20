import { UIMessage } from "@/types/chat.types";

// ✅ ADD: Export interface
export interface EncryptedMessage {
  cipher_text: string;
  nonce: string;
  tag: string;
  encryption_algo: string;
}

// ✅ UPDATED: Helper to convert Uint8Array to proper ArrayBuffer
function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  // Create new ArrayBuffer and copy data to ensure it's not SharedArrayBuffer
  const buffer = new ArrayBuffer(u8.byteLength);
  new Uint8Array(buffer).set(u8);
  return buffer;
}

// ✅ UPDATED: Helper to decode base64 to proper ArrayBuffer
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

/* ================================
   Encrypt plaintext message
================================ */
export async function encryptMessage(
  plaintext: string,
  base64Key: string
): Promise<EncryptedMessage> {
  if (!plaintext) throw new Error("Plaintext cannot be empty");
  if (!base64Key) throw new Error("Base64 key is required");

  // 1. Decode base64 key
  let keyBuffer: ArrayBuffer;
  try {
    keyBuffer = b64ToArrayBuffer(base64Key);
  } catch (err) {
    throw new Error(`Invalid base64 key format: ${err}`);
  }

  // ✅ Validate key size (256-bit = 32 bytes)
  if (keyBuffer.byteLength !== 32) {
    throw new Error(
      `Invalid AES-256 key size: expected 32 bytes, got ${keyBuffer.byteLength}`
    );
  }

  // 2. Import key
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    "AES-GCM",
    false,
    ["encrypt"]
  );

  // 3. Generate nonce (12 bytes for GCM)
  const nonce = crypto.getRandomValues(new Uint8Array(12));

  // 4. Encrypt
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: toArrayBuffer(nonce), // ✅ Convert to proper ArrayBuffer
      tagLength: 128,
    },
    key,
    new TextEncoder().encode(plaintext)
  );

  // 5. Split cipher + tag
  const encryptedBytes = new Uint8Array(encrypted);
  const cipherBytes = encryptedBytes.slice(0, encryptedBytes.length - 16);
  const tagBytes = encryptedBytes.slice(encryptedBytes.length - 16);

  // ✅ Validate sizes
  if (nonce.length !== 12) {
    throw new Error("Nonce generation failed: expected 12 bytes");
  }
  if (tagBytes.length !== 16) {
    throw new Error("Tag generation failed: expected 16 bytes");
  }

  return {
    cipher_text: btoa(String.fromCharCode(...cipherBytes)),
    nonce: btoa(String.fromCharCode(...nonce)),
    tag: btoa(String.fromCharCode(...tagBytes)),
    encryption_algo: "AES-256-GCM",
  };
}

/* ================================
   Decrypt message components
================================ */
export async function decryptMessage(
  cipherText: string,
  nonce: string,
  base64Key: string,
  tag: string
): Promise<string> {
  // ✅ Validate inputs
  if (!cipherText) throw new Error("cipherText is required");
  if (!nonce) throw new Error("nonce is required");
  if (!base64Key) throw new Error("base64Key is required");
  if (!tag) throw new Error("tag is required");

  let keyBuffer: ArrayBuffer;
  let cipherBuffer: ArrayBuffer;
  let nonceBuffer: ArrayBuffer;
  let tagBuffer: ArrayBuffer;

  // 1. Decode all components to ArrayBuffer
  try {
    keyBuffer = b64ToArrayBuffer(base64Key);
    cipherBuffer = b64ToArrayBuffer(cipherText);
    nonceBuffer = b64ToArrayBuffer(nonce);
    tagBuffer = b64ToArrayBuffer(tag);
  } catch (err) {
    throw new Error(`Base64 decode error: ${err}`);
  }

  // ✅ UPDATED: Better error messages with actual values
  if (keyBuffer.byteLength !== 32) {
    throw new Error(
      `Invalid key size: expected 32 bytes, got ${keyBuffer.byteLength} (base64 len: ${base64Key.length})`
    );
  }
  if (nonceBuffer.byteLength !== 12) {
    // ✅ Show base64 nonce for debugging
    console.error("❌ Invalid nonce:", {
      base64: nonce,
      decoded_length: nonceBuffer.byteLength,
      expected: 12,
    });
    throw new Error(
      `Invalid nonce size: expected 12 bytes, got ${nonceBuffer.byteLength}`
    );
  }
  if (tagBuffer.byteLength !== 16) {
    throw new Error(
      `Invalid tag size: expected 16 bytes, got ${tagBuffer.byteLength}`
    );
  }

  // 2. Import key
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    "AES-GCM",
    false,
    ["decrypt"]
  );

  // 3. Combine cipher + tag
  const combinedSize = cipherBuffer.byteLength + tagBuffer.byteLength;
  const combined = new Uint8Array(combinedSize);
  combined.set(new Uint8Array(cipherBuffer), 0);
  combined.set(new Uint8Array(tagBuffer), cipherBuffer.byteLength);

  // 4. Decrypt
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: nonceBuffer,
        tagLength: 128,
      },
      key,
      toArrayBuffer(combined)
    );

    return new TextDecoder().decode(decrypted);
  } catch (err: any) {
    // ✅ ENHANCED: Log all components for debugging
    console.error("❌ Decrypt failed:", {
      error: err.message,
      errorType: err.name,
      cipherLen: cipherBuffer.byteLength,
      nonceLen: nonceBuffer.byteLength,
      tagLen: tagBuffer.byteLength,
      keyLen: keyBuffer.byteLength,
      // ✅ Log first few chars of base64 for debugging
      cipher_preview: cipherText.substring(0, 20) + "...",
      nonce_preview: nonce.substring(0, 20) + "...",
      tag_preview: tag.substring(0, 20) + "...",
    });

    // ✅ Better error message
    if (err.name === "OperationError") {
      throw new Error("Invalid encryption data or wrong key");
    }

    throw new Error(`Decryption failed: ${err.message}`);
  }
}

/* ================================
   Helper: Normalize encryption components
================================ */
function normalizeEncComponent(
  comp: string | number[] | null | undefined
): string | null {
  if (!comp) return null;

  // Already string (base64 from backend)
  if (typeof comp === "string") return comp;

  // Legacy: number[] to base64
  if (Array.isArray(comp)) {
    try {
      const str = String.fromCharCode(...comp);
      atob(str); // validate base64
      return str;
    } catch {
      // Raw bytes, encode to base64
      try {
        return btoa(String.fromCharCode(...comp));
      } catch {
        return null;
      }
    }
  }

  return null;
}

/* ================================
   Decrypt UIMessage helper
================================ */
export async function decryptUIMessage(
  message: UIMessage,
  conversationKey: string
): Promise<string> {
  try {
    const cipherText = normalizeEncComponent(message.cipher_text);
    const nonce = normalizeEncComponent(message.nonce);
    const tag = normalizeEncComponent(message.tag);

    // ✅ Better error messages
    if (!cipherText) return "[Missing cipher_text]";
    if (!nonce) return "[Missing nonce]";
    if (!tag) return "[Missing tag]";

    return await decryptMessage(cipherText, nonce, conversationKey, tag);
  } catch (err: any) {
    console.error("❌ decryptUIMessage failed:", {
      msgId: message.id?.substring(0, 8),
      error: err.message,
    });
    return `[Decryption failed: ${err.message}]`;
  }
}
