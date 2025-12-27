"use client";

import { Message } from "@/types/database.types";
import { handleResponse } from "@/utils/response";

class MessageService {
  /**
   * Send a message to a conversation
   */
  async sendMessage(payload: {
    conversation_id: string;
    sender_user_id: string;
    content: string; // ✅ Plain text
    reply_to_message_id?: string | null;
    attachments?: any[];
    client_id: string;
  }): Promise<Message> {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  }

  async getMessages(conversationId: string, limit = 50, offset = 0) {
    const res = await fetch(
      `/api/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`,
      {
        credentials: "include",
      }
    );
    return handleResponse(res);
  }

  // ✅ Update message status (for read receipts)
  async updateMessageStatus(messageId: string, status: string): Promise<void> {
    const res = await fetch(`/api/messages/${messageId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  }

  // ✅ Delete message
  async deleteMessage(messageId: string): Promise<void> {
    const res = await fetch(`/api/messages/${messageId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse(res);
  }

  // ✅ React to message
  async addReaction(messageId: string, emoji: string): Promise<void> {
    const res = await fetch(`/api/messages/${messageId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ kind: "custom", custom_code: emoji }),
    });
    return handleResponse(res);
  }

  // ✅ ADD: Add attachment to message
  async addAttachment(
    messageId: string,
    payload: {
      url: string;
      file_type: string;
      file_size: number;
      file_name: string;
    }
  ): Promise<void> {
    const res = await fetch(`/api/messages/${messageId}/attachments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  }

  // ✅ ADD: Delete attachment from message
  async deleteAttachment(
    messageId: string,
    attachmentId: string
  ): Promise<void> {
    const res = await fetch(
      `/api/messages/${messageId}/attachments/${attachmentId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    return handleResponse(res);
  }
}

export const messageService = new MessageService();
