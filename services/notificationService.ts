"use client";

import { handleResponse } from "@/utils/response";
import { Notification } from "@/types/database.types";

class NotificationService {
  async createNotification(payload: {
    title: string;
    message: string;
    user_id: string;
  }): Promise<Notification> {
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async listNotifications(userId: string): Promise<Notification[]> {
    const res = await fetch(`/api/notifications/users/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async listUnreadNotifications(userId: string): Promise<Notification[]> {
    const res = await fetch(`/api/notifications/users/${userId}/unread`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async countUnread(userId: string): Promise<number> {
    const res = await fetch(`/api/notifications/users/${userId}/unread/count`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async markRead(notificationId: string): Promise<void> {
    const res = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async markAllRead(userId: string): Promise<void> {
    const res = await fetch(`/api/notifications/users/${userId}/read-all`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const res = await fetch(`/api/notifications/${notificationId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }
}

export const notificationService = new NotificationService();
