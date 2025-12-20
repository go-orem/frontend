import { useConversationContext } from "@/context/ConversationProvider";
import { conversationService } from "@/services/conversationService";
import { messageService } from "@/services/messageService";
import { ConversationsWithMemberBody } from "@/types/conversations.types";
import { ConversationType, Message } from "@/types/database.types";
import { toUIMessages } from "@/types/chat.types";
import {
  generateConversationKey,
  exportRawKey,
  encryptConversationKey,
  decryptConversationKey,
} from "@/utils/crypto/conversationKey";
import { getPrivateKey, importPublicKey } from "@/utils/crypto/userKeys"; // ✅ get user's ECDH private key
import { useAuth } from "./useAuth";

export function useConversations() {
  const { isAuthenticated, loading: authLoading, user } = useAuth(); // ✅ also get user
  const {
    setConversations,
    setMessages,
    setLoading,
    messages,
    setConversationKeys,
    conversationKeys,
  } = useConversationContext();

  async function refreshConversations(type: ConversationType | null = null) {
    setLoading(true);
    try {
      const data = await conversationService.listWithLastMessage(type);
      setConversations(data);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(
    conversationId: string,
    opts?: { skipIfCached?: boolean }
  ) {
    if (authLoading || !isAuthenticated) return;

    if (opts?.skipIfCached && messages[conversationId]) {
      console.log("⚠️ Messages already cached, skip fetch");
      // ✅ CRITICAL: Always ensure key exists even on cached messages
      if (!conversationKeys[conversationId]) {
        console.log("🔑 Key missing for cached messages, fetching...");
        await ensureConversationKey(conversationId);
      }
      return;
    }

    setLoading(true);
    try {
      // ✅ CRITICAL: Fetch conversation key FIRST before loading messages
      if (!conversationKeys[conversationId]) {
        console.log("🔑 Fetching conversation key before messages...");
        await ensureConversationKey(conversationId);
      }

      // ✅ Verify key exists before loading messages
      const keyAfterFetch = conversationKeys[conversationId];
      if (!keyAfterFetch) {
        console.warn(
          "❌ Failed to fetch conversation key, cannot decrypt messages"
        );
        throw new Error("Conversation key not available");
      }

      console.log("✅ Conversation key ready:", {
        conversationId,
        keyPreview: keyAfterFetch.substring(0, 16) + "...",
      });

      const dbMessages: Message[] = await conversationService.listMessages(
        conversationId
      );

      const sortedMessages = dbMessages.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const uiMessages = toUIMessages(sortedMessages);

      setMessages((prev) => ({
        ...prev,
        [conversationId]: uiMessages,
      }));
    } catch (err) {
      console.error("❌ Failed to load messages:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // ✅ UPDATED: Better error handling and logging
  async function ensureConversationKey(conversationId: string) {
    try {
      if (!user?.user?.id) {
        console.error("❌ No user ID for fetching conversation key");
        return;
      }

      console.log("🔑 Fetching conversation key for:", conversationId);

      const keyDTO: any = await conversationService.getConversationKey(
        conversationId
      );

      if (!keyDTO) {
        console.error("❌ No key DTO returned from backend");
        return;
      }

      console.log("✅ Fetched conversation key DTO:", {
        has_encrypted_key: !!keyDTO.encrypted_key,
        key_algo: keyDTO.key_algo,
        key_version: keyDTO.key_version,
      });

      // Normalize from DTO
      let cipher: string | null = null;
      let iv: string | null = null;
      let eph: string | null = null;

      // Case A: backend packs JSON string in `encrypted_key`
      if (typeof keyDTO.encrypted_key === "string") {
        try {
          const packed = JSON.parse(keyDTO.encrypted_key);
          cipher = packed?.cipher ?? null;
          iv = packed?.iv ?? packed?.nonce ?? null;
          eph = packed?.eph_public_key ?? packed?.ephemeral_public_key ?? null;
        } catch {
          console.warn("⚠️ encrypted_key is not JSON");
        }
      }

      // Case B: flattened fields
      if (!cipher) cipher = keyDTO.cipher || keyDTO.cipher_text || null;
      if (!iv) iv = keyDTO.iv || keyDTO.nonce || null;
      if (!eph)
        eph = keyDTO.eph_public_key || keyDTO.ephemeral_public_key || null;

      if (!cipher || !iv || !eph) {
        console.error("❌ Incomplete conversation key DTO:", {
          has_cipher: !!cipher,
          has_iv: !!iv,
          has_eph: !!eph,
        });
        return;
      }

      const priv = await getPrivateKey(user.user.id);
      if (!priv) {
        console.error("❌ No private key found for user");
        return;
      }

      console.log("🔓 Decrypting conversation key...");
      const base64Key = await decryptConversationKey({
        cipher,
        iv,
        eph_public_key: eph,
        recipientPrivateKey: priv,
      });

      console.log("✅ Conversation key decrypted successfully:", {
        keyPreview: base64Key.substring(0, 16) + "...",
        keyLength: base64Key.length,
      });

      setConversationKeys((prev) => ({
        ...prev,
        [conversationId]: base64Key,
      }));
    } catch (e) {
      console.error("❌ Failed to ensure conversation key:", e);
      throw e; // ✅ Re-throw to prevent loading messages without key
    }
  }

  async function createConversation(body: ConversationsWithMemberBody) {
    setLoading(true);
    try {
      // 1. Create conversation first
      const conv = await conversationService.createWithMembers(body);

      // 2. Generate conversation key
      const key = await generateConversationKey();
      const rawKey = await exportRawKey(key);
      const base64Key = btoa(String.fromCharCode(...rawKey));

      // 3. Store locally
      setConversationKeys((prev) => ({
        ...prev,
        [conv.id]: base64Key,
      }));

      // 4. ✅ Encrypt key for each member and upload
      // Get member public keys from conversation detail
      const detail = await conversationService.getConversationDetail(conv.id);

      for (const member of detail.members || []) {
        try {
          // ✅ FIX: Use correct field - check member.public_key or fetch from user service
          const publicKey = member.public_key || member.user?.public_key;

          if (!publicKey) {
            console.warn(`Member ${member.user_id} has no public key`);
            continue;
          }

          // Import recipient's public key
          const recipientPubKey = await importPublicKey(publicKey);

          // Encrypt conversation key for this member
          const encryptedKey = await encryptConversationKey(
            rawKey,
            recipientPubKey
          );

          // Upload to backend
          await conversationService.updateMemberKey(conv.id, member.id, {
            encrypted_conversation_key: JSON.stringify(encryptedKey),
            key_algo: "X25519+AES-GCM",
            key_version: 1,
          });
        } catch (err) {
          console.error(
            `Failed to encrypt key for member ${member.user_id}:`,
            err
          );
        }
      }

      await refreshConversations();
      return conv;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Mark messages as read when conversation is opened
   */
  async function markConversationAsRead(conversationId: string) {
    const msgs = messages[conversationId] ?? [];
    const unreadMsgs = msgs.filter((m) => m.status !== "read");

    for (const msg of unreadMsgs) {
      try {
        // ✅ Use msg.id (bukan msg.client_id) untuk backend
        await messageService.updateMessageStatus(msg.id, "read");

        // ✅ Update local state immediately
        setMessages((prev) => ({
          ...prev,
          [conversationId]: prev[conversationId]?.map((m) =>
            m.id === msg.id ? { ...m, status: "read" as const } : m
          ),
        }));
      } catch (err) {
        console.error(`Failed to mark message ${msg.id} as read:`, err);
      }
    }
  }

  return {
    refreshConversations,
    loadMessages,
    createConversation,
    markConversationAsRead,
  };
}
