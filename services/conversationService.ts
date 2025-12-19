"use client";

import { handleResponse } from "@/utils/response";
import {
  Conversation,
  ConversationMember,
  ConversationType,
  ConversationWithLastMessage,
  Message,
} from "@/types/database.types";
import { ConversationsWithMemberBody } from "@/types/conversations.types";

class ConversationService {
  async listPublic(): Promise<Conversation[]> {
    const res = await fetch("/api/conversations/public", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async listUserConversations(): Promise<Conversation[]> {
    const res = await fetch("/api/conversations", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async getConversationDetail(id: string): Promise<{
    conversation: Conversation;
    members: ConversationMember[];
    tags: { id: string; name: string }[];
  }> {
    const res = await fetch(`/api/conversations/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async listWithLastMessage(
    type: ConversationType | null
  ): Promise<ConversationWithLastMessage[]> {
    const res = await fetch(
      `/api/conversations/with-last-message?conversation_type=${
        type ? type : ""
      }`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    return handleResponse(res);
  }

  async createWithMembers(
    body: ConversationsWithMemberBody
  ): Promise<Conversation> {
    const res = await fetch("/api/conversations/with-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async addMember(
    conversationId: string,
    userId: string
  ): Promise<ConversationMember> {
    const res = await fetch(`/api/conversations/${conversationId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async removeMember(conversationId: string, memberId: string): Promise<void> {
    const res = await fetch(
      `/api/conversations/${conversationId}/members/${memberId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    return handleResponse(res);
  }

  async listMessages(conversationId: string): Promise<Message[]> {
    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

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
    client_id: string; // ⬅️ penting untuk optimistic
  }): Promise<void> {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    await handleResponse(res);
  }

  async getConversationKey(conversationId: string): Promise<{
    encrypted_key: string;
    key_algo: string;
    key_version: number;
    // allow backend variations
    cipher?: string;
    iv?: string;
    eph_public_key?: string;
  }> {
    const res = await fetch(`/api/conversations/${conversationId}/key`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async updateMemberKey(
    conversationId: string,
    memberId: string,
    keyData: {
      encrypted_conversation_key: string;
      key_algo: string;
      key_version: number;
    }
  ): Promise<void> {
    const res = await fetch(
      `/api/conversations/${conversationId}/members/${memberId}/key`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(keyData),
      }
    );
    return handleResponse(res);
  }
}

export const conversationService = new ConversationService();
