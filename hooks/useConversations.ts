import { useConversationContext } from "@/context/ConversationContext";
import { conversationService } from "@/services/conversationService";
import { ConversationsWithMemberBody } from "@/types/conversations";
import { ConversationType } from "@/types/database.types";

export function useConversations() {
  const { setConversations, setMessages, setLoading } =
    useConversationContext();

  async function refreshConversations(type: ConversationType | null = null) {
    setLoading(true);
    try {
      const data = await conversationService.listWithLastMessage(type);
      setConversations(data);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(conversationId: string) {
    setLoading(true);
    try {
      const msgs = await conversationService.listMessages(conversationId);
      setMessages((prev) => ({ ...prev, [conversationId]: msgs }));
    } catch (err) {
      throw err;
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
    } catch (err) {
      throw err;
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
