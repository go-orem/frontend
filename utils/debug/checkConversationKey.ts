import { openDB } from "idb";

export async function debugConversationKey(
  conversationId: string,
  conversationKeys: Record<string, string>
) {
  console.group("🔍 DEBUG: Conversation Key Check");

  // 1. Check context
  const contextKey = conversationKeys[conversationId];
  console.log("Context Key:", {
    exists: !!contextKey,
    preview: contextKey?.substring(0, 16) + "...",
    length: contextKey?.length,
  });

  // 2. Check backend
  try {
    const response = await fetch(`/api/conversations/${conversationId}/key`, {
      method: "GET",
      credentials: "include",
    });
    const backendKey = await response.json();
    console.log("Backend Key:", {
      exists: !!backendKey.data?.encrypted_key,
      algo: backendKey.data?.key_algo,
      version: backendKey.data?.key_version,
    });
  } catch (err) {
    console.error("Failed to fetch backend key:", err);
  }

  // 3. Check IndexedDB user key
  const db = await openDB("orem_crypto", 1);
  const userKeys = await db.getAll("user_keys");
  console.log("User Keys in IndexedDB:", userKeys.length);

  console.groupEnd();
}
