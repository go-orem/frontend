import { useConversationContext } from "@/context/ConversationProvider";
import { conversationService } from "@/services/conversationService";
import { messageService } from "@/services/messageService";
import { ConversationsWithMemberBody } from "@/types/conversations.types";
import { ConversationType, Message } from "@/types/database.types";
import { toUIMessages } from "@/types/chat.types";
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { useWS } from "@/context";

export function useConversations() {
  const {
    conversations,
    setConversations,
    messages,
    setMessages,
    loading,
    setLoading,
  } = useConversationContext();

  const { user } = useAuth();
  const ws = useWS();

  // ✅ Handle WebSocket message_created event
  useEffect(() => {
    if (!ws.connected) return;

    // Note: Event handler is in ConversationProvider
    // This is just for subscribing to rooms in components

    return () => {
      // Cleanup if needed
    };
  }, [ws.connected, setMessages, setConversations]);

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
    if (opts?.skipIfCached && messages[conversationId]) {
      console.log("⚠️ Messages already cached, skip fetch");
      return;
    }

    setLoading(true);
    try {
      console.log("📨 Loading messages for conversation:", conversationId);

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

      console.log("✅ Messages loaded:", uiMessages.length);
    } catch (err) {
      console.error("❌ Failed to load messages:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function createConversation(body: ConversationsWithMemberBody) {
    setLoading(true);
    try {
      console.log("🆕 Creating conversation...");

      // ✅ Simple conversation creation without encryption
      const conv = await conversationService.createWithMembers(body);

      console.log("✅ Conversation created:", conv.id);

      await refreshConversations();
      return conv;
    } catch (err) {
      console.error("❌ Failed to create conversation:", err);
      throw err;
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
        // ✅ Use msg.id for backend
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
