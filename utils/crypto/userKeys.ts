// src/crypto/userKeys.ts
import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "orem_crypto";
const DB_VERSION = 1;
const STORE_USER_KEYS = "user_keys";

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDB() {
  if (!dbPromise) {
    if (typeof window === "undefined") {
      throw new Error("IndexedDB is not available on server");
    }

    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_USER_KEYS)) {
          db.createObjectStore(STORE_USER_KEYS);
        }
      },
    });
  }
  return dbPromise;
}

/* ================================
   Generate ECDH key pair (P-256)
================================ */
export async function generateUserKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"]
  );
}

/* ================================
   Save private key to IndexedDB
================================ */
export async function savePrivateKey(
  userID: string,
  privateKey: CryptoKey
): Promise<void> {
  if (!userID) throw new Error("UserID is required");
  if (!privateKey) throw new Error("PrivateKey is required");

  const db = await getDB();
  await db.put(STORE_USER_KEYS, privateKey, userID);
}

/* ================================
   Get private key from IndexedDB
================================ */
export async function getPrivateKey(userID: string): Promise<CryptoKey | null> {
  if (!userID) throw new Error("UserID is required");

  const db = await getDB();
  return (await db.get(STORE_USER_KEYS, userID)) || null;
}

/* ================================
   Export public key as base64
================================ */
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  if (!publicKey) throw new Error("PublicKey is required");

  const raw = await crypto.subtle.exportKey("raw", publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

/* ================================
   Import public key from base64
================================ */
export async function importPublicKey(base64: string): Promise<CryptoKey> {
  if (!base64) throw new Error("Base64 public key is required");

  // ✅ Decode to proper ArrayBuffer
  let raw: ArrayBuffer;
  try {
    const binary = atob(base64);
    raw = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(raw);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
  } catch (err) {
    throw new Error(`Invalid base64 public key format: ${err}`);
  }

  // ✅ Validate expected key size (P-256 uncompressed = 65 bytes)
  if (raw.byteLength !== 65) {
    throw new Error(
      `Invalid P-256 public key size: expected 65 bytes, got ${raw.byteLength}`
    );
  }

  // ✅ Direct import with proper ArrayBuffer
  return crypto.subtle.importKey(
    "raw",
    raw,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
}
