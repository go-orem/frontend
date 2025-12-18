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
   Generate key pair (ECDH)
================================ */
export async function generateUserKeyPair() {
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
   Save private key (IndexedDB)
================================ */
export async function savePrivateKey(userID: string, privateKey: CryptoKey) {
  const db = await getDB();
  await db.put(STORE_USER_KEYS, privateKey, userID);
}

/* ================================
   Get private key
================================ */
export async function getPrivateKey(userID: string): Promise<CryptoKey | null> {
  const db = await getDB();
  return (await db.get(STORE_USER_KEYS, userID)) || null;
}

/* ================================
   Export public key (Base64)
================================ */
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

/* ================================
   Import public key
================================ */
export async function importPublicKey(base64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
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
