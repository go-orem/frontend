import { useConversationContext } from "@/context/ConversationProvider";
import { conversationService } from "@/services/conversationService";
import { messageService } from "@/services/messageService";
import { ConversationsWithMemberBody } from "@/types/conversations.types";
import { ConversationType, Message } from "@/types/database.types";
import { toUIMessages } from "@/types/chat.types";
import { useAuth } from "./useAuth";

export function useConversations() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { setConversations, setMessages, setLoading, messages } =
    useConversationContext();

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
      return;
    }

    setLoading(true);
    try {
      // ✅ Fetch dari backend returns Message[]
      const dbMessages: Message[] = await conversationService.listMessages(
        conversationId
      );

      // ✅ Convert ke UIMessage[] sebelum set state
      const uiMessages = toUIMessages(dbMessages);

      setMessages((prev) => ({
        ...prev,
        [conversationId]: uiMessages,
      }));
    } finally {
      setLoading(false);
    }
  }

  async function createConversation(body: ConversationsWithMemberBody) {
    setLoading(true);
    try {
      const conv = await conversationService.createWithMembers(body);
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
