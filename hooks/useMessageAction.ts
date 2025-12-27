// useMessageActions.ts
"use client";

import { v4 as uuid } from "uuid";
import { conversationService } from "@/services/conversationService";
import { useConversationContext } from "@/context/ConversationProvider";
import { createOptimisticMessage } from "@/types/chat.types";

export function useMessageActions(userId: string) {
  const { setMessages } = useConversationContext();

  async function sendMessage(conversationId: string, plainText: string) {
    const clientId = `client-${uuid()}`;

    // 1️⃣ optimistic insert with plain text
    setMessages((prev) => {
      const list = prev[conversationId] ?? [];

      return {
        ...prev,
        [conversationId]: [
          ...list,
          createOptimisticMessage({
            client_id: clientId,
            conversation_id: conversationId,
            sender_user_id: userId,
            content: plainText, // ✅ Plain text
          }),
        ],
      };
    });

    try {
      // 2️⃣ persist with blockchain hash
      await conversationService.sendMessage({
        conversation_id: conversationId,
        sender_user_id: userId,
        content: plainText, // ✅ Plain text
        reply_to_message_id: null,
        attachments: [],
        client_id: clientId,
      });
    } catch (err) {
      // 3️⃣ rollback
      setMessages((prev) => ({
        ...prev,
        [conversationId]: prev[conversationId].filter((m) => m.id !== clientId),
      }));
      throw err;
    }
  }

  return { sendMessage };
}
