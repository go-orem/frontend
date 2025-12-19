"use client";

import { handleResponse } from "@/utils/response";
import { FriendRequest, Friendship } from "@/types/database.types";

class FriendService {
  // Friend Requests
  async sendRequest(toUserId: string): Promise<FriendRequest> {
    const res = await fetch("/api/friends/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to_user_id: toUserId }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async acceptRequest(requestId: string): Promise<FriendRequest> {
    const res = await fetch(`/api/friends/requests/${requestId}/accept`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async rejectRequest(requestId: string): Promise<void> {
    const res = await fetch(`/api/friends/requests/${requestId}/reject`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async cancelRequest(requestId: string): Promise<void> {
    const res = await fetch(`/api/friends/requests/${requestId}/cancel`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async listRequests(): Promise<FriendRequest[]> {
    const res = await fetch("/api/friends/requests", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  // Friendships
  async listFriends(): Promise<Friendship[]> {
    const res = await fetch("/api/friends", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async blockFriend(userId: string): Promise<void> {
    const res = await fetch("/api/friends/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async removeFriend(userId: string): Promise<void> {
    const res = await fetch("/api/friends/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async activateFriend(userId: string): Promise<void> {
    const res = await fetch("/api/friends/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
      credentials: "include",
    });
    return handleResponse(res);
  }
}

export const friendService = new FriendService();
