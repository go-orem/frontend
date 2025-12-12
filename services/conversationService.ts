"use client";

import { handleResponse } from "@/utils/response";
import {
  Conversation,
  ConversationMember,
  ConversationType,
  ConversationWithLastMessage,
  Message,
} from "@/types/database.types";
import { ConversationsWithMemberBody } from "@/types/conversations";

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
}

export const conversationService = new ConversationService();
