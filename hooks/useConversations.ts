import { useConversationContext } from "@/context/ConversationContext";
import { conversationService } from "@/services/conversationService";
import { ConversationsWithMemberBody } from "@/types/conversations";
import { ConversationType, Message } from "@/types/database.types";
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
      const msgs: Message[] = await conversationService.listMessages(
        conversationId
      );
      setMessages((prev) => ({ ...prev, [conversationId]: msgs }));
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

  return {
    refreshConversations,
    loadMessages,
    createConversation,
  };
}
