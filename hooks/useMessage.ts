"use client";

import { v4 as uuid } from "uuid";
import { messageService } from "@/services/messageService";
import { useConversationContext } from "@/context/ConversationProvider";
import { createOptimisticMessage, toUIMessage } from "@/types/chat.types";
import { MessageStatus } from "@/types/database.types";

export function useMessage(userId: string) {
  const { setMessages, messages } = useConversationContext();

  /**
   * Send message with optimistic update
   */
  async function sendMessage(conversationId: string, plainText: string) {
    const clientId = `client-${uuid()}`;

    console.log("📨 Sending message:", {
      conversationId,
      contentLength: plainText.length,
    });

    // 1️⃣ Optimistic insert with plain text
    const optimisticMsg = createOptimisticMessage({
      client_id: clientId,
      conversation_id: conversationId,
      sender_user_id: userId,
      content: plainText, // ✅ Plain text
    });

    setMessages((prev) => {
      const list = prev[conversationId] ?? [];
      return {
        ...prev,
        [conversationId]: [...list, optimisticMsg],
      };
    });

    try {
      // 2️⃣ Persist to backend with plain text
      const response = await messageService.sendMessage({
        conversation_id: conversationId,
        sender_user_id: userId,
        content: plainText, // ✅ Plain text
        reply_to_message_id: null,
        attachments: [],
        client_id: clientId,
      });

      console.log("✅ Message sent successfully:", response.id);

      // 3️⃣ Replace optimistic message with actual message from backend
      const uiMessage = toUIMessage(response);
      setMessages((prev) => ({
        ...prev,
        [conversationId]: prev[conversationId]?.map((m) =>
          m.client_id === clientId ? uiMessage : m
        ),
      }));
    } catch (err) {
      console.error("❌ Failed to send message:", err);

      // 4️⃣ Rollback on error
      setMessages((prev) => ({
        ...prev,
        [conversationId]: prev[conversationId]?.filter(
          (m) => m.client_id !== clientId
        ),
      }));
      throw err;
    }
  }

  /**
   * Add emoji reaction to message
   */
  async function addReaction(messageId: string, emoji: string) {
    try {
      await messageService.addReaction(messageId, emoji);
    } catch (err) {
      console.error("Failed to add reaction:", err);
      throw err;
    }
  }

  /**
   * Delete a message
   */
  async function deleteMessage(messageId: string) {
    try {
      // Find which conversation this message belongs to
      const conversationId = Object.entries(messages).find(([_, msgs]) =>
        msgs.some((m) => m.id === messageId)
      )?.[0];

      if (!conversationId) {
        console.error(`Message ${messageId} not found in any conversation`);
        return;
      }

      // Optimistic delete
      setMessages((prev) => ({
        ...prev,
        [conversationId]: prev[conversationId]?.filter(
          (m) => m.id !== messageId
        ),
      }));

      // Persist deletion
      await messageService.deleteMessage(messageId);
    } catch (err) {
      console.error("Failed to delete message:", err);
      throw err;
    }
  }

  /**
   * Update message status
   */
  async function updateStatus(messageId: string, status: MessageStatus) {
    try {
      await messageService.updateMessageStatus(messageId, status);
    } catch (err) {
      console.error("Failed to update message status:", err);
      throw err;
    }
  }

  /**
   * Add attachment to message
   */
  async function addAttachment(
    messageId: string,
    file: File,
    uploadUrl: string
  ) {
    try {
      await messageService.addAttachment(messageId, {
        url: uploadUrl,
        file_type: file.type,
        file_size: file.size,
        file_name: file.name,
      });
    } catch (err) {
      console.error("Failed to add attachment:", err);
      throw err;
    }
  }

  /**
   * Delete attachment from message
   */
  async function deleteAttachment(messageId: string, attachmentId: string) {
    try {
      await messageService.deleteAttachment(messageId, attachmentId);
    } catch (err) {
      console.error("Failed to delete attachment:", err);
      throw err;
    }
  }

  return {
    sendMessage,
    addReaction,
    deleteMessage,
    updateStatus,
    addAttachment,
    deleteAttachment,
  };
}
