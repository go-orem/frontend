"use client";

import { handleResponse } from "@/utils/response";
import {
  Message,
  MessageReaction,
  MessageAttachment,
  MessageStatus,
} from "@/types/database.types";

class MessageService {
  /**
   * Send a message to a conversation
   */
  async sendMessage(payload: {
    conversation_id: string;
    sender_user_id: string;
    target_user_id?: string;
    cipher_text: string;
    nonce: string;
    tag: string | null;
    encryption_algo: string;
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

  /**
   * List messages in a conversation with pagination
   */
  async listMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> {
    const res = await fetch(
      `/api/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    return handleResponse(res);
  }

  /**
   * Add a reaction to a message
   */
  async addReaction(
    messageId: string,
    payload: {
      kind: string; // emoji reaction type
      user_id: string;
    }
  ): Promise<MessageReaction> {
    const res = await fetch(`/api/messages/${messageId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  }

  /**
   * Add attachment to a message
   */
  async addAttachment(
    messageId: string,
    payload: {
      url: string;
      file_type: string;
      file_size: number;
      file_name: string;
    }
  ): Promise<MessageAttachment> {
    const res = await fetch(`/api/messages/${messageId}/attachments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  }

  /**
   * Update message status (sent/delivered/read/queued/etc)
   * ✅ FIX: Accept any MessageStatus
   */
  async updateMessageStatus(
    messageId: string,
    status: MessageStatus
  ): Promise<void> {
    const res = await fetch(`/api/messages/${messageId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    const res = await fetch(`/api/messages/${messageId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  /**
   * Delete an attachment from a message
   */
  async deleteAttachment(
    messageId: string,
    attachmentId: string
  ): Promise<void> {
    const res = await fetch(
      `/api/messages/${messageId}/attachments/${attachmentId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    return handleResponse(res);
  }
}

export const messageService = new MessageService();
