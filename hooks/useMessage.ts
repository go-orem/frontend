"use client";

import { v4 as uuid } from "uuid";
import { messageService } from "@/services/messageService";
import { useConversationContext } from "@/context/ConversationProvider";
import { createOptimisticMessage, toUIMessage } from "@/types/chat.types";
import { MessageStatus } from "@/types/database.types";
import { encryptMessage } from "@/utils";
import {
  generateConversationKey,
  exportRawKey,
} from "@/utils/crypto/conversationKey";

export function useMessage(userId: string) {
  const { setMessages, messages, conversationKeys, setConversationKeys } =
    useConversationContext();

  /**
   * Send message with optimistic update
   */
  async function sendMessage(conversationId: string, plainText: string) {
    const clientId = `client-${uuid()}`;

    // 🔐 Get conversation key (should already exist from useConversations.loadMessages)
    let conversationKey = conversationKeys[conversationId];

    // ✅ FIX: DO NOT generate new key if missing - this causes mismatch
    if (!conversationKey) {
      console.error("❌ No conversation key found for:", conversationId);
      throw new Error(
        "Conversation key not initialized. Please refresh and try again."
      );
    }

    // ✅ Log key for debugging
    console.log("🔑 Using conversation key:", {
      conversationId,
      keyPreview: conversationKey.substring(0, 16) + "...",
      keyLength: conversationKey.length,
    });

    const encrypted = await encryptMessage(plainText, conversationKey);

    // ✅ Validate encrypted components
    console.log("🔐 Encrypted message:", {
      cipher_len: encrypted.cipher_text.length,
      nonce_len: encrypted.nonce.length,
      tag_len: encrypted.tag.length,
    });

    // 1️⃣ Optimistic insert
    const optimisticMsg = createOptimisticMessage({
      client_id: clientId,
      conversation_id: conversationId,
      sender_user_id: userId,
      cipher_text: encrypted.cipher_text,
      nonce: encrypted.nonce,
      tag: encrypted.tag,
      content: plainText,
    });

    setMessages((prev) => {
      const list = prev[conversationId] ?? [];
      return {
        ...prev,
        [conversationId]: [...list, optimisticMsg],
      };
    });

    try {
      // 2️⃣ Persist to backend
      const response = await messageService.sendMessage({
        conversation_id: conversationId,
        sender_user_id: userId,
        cipher_text: encrypted.cipher_text,
        nonce: encrypted.nonce,
        tag: encrypted.tag,
        encryption_algo: "AES-256-GCM",
        reply_to_message_id: null,
        attachments: [],
        client_id: clientId,
      });

      // 3️⃣ Replace optimistic message dengan actual message dari backend
      const uiMessage = toUIMessage(response);
      setMessages((prev) => ({
        ...prev,
        [conversationId]: prev[conversationId]?.map((m) =>
          m.client_id === clientId ? uiMessage : m
        ),
      }));
    } catch (err) {
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
      await messageService.addReaction(messageId, {
        kind: emoji,
        user_id: userId,
      });
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
