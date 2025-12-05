"use client";

import { handleResponse } from "@/utils/response";
import { Contact, Profile } from "@/types/database.types";

class UserService {
  async getProfile(userId: string): Promise<Profile> {
    const res = await fetch(`/api/users/${userId}/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async updateProfile(
    userId: string,
    payload: Partial<Profile>
  ): Promise<Profile> {
    const res = await fetch(`/api/users/${userId}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async listContacts(userId: string): Promise<Contact[]> {
    const res = await fetch(`/api/users/${userId}/contacts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async addContact(
    userId: string,
    payload: { contact_user_id: string; saved_name?: string }
  ): Promise<Contact> {
    const res = await fetch(`/api/users/${userId}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async updateContact(
    userId: string,
    contactId: string,
    payload: Partial<Contact>
  ): Promise<Contact> {
    const res = await fetch(`/api/users/${userId}/contacts/${contactId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse(res);
  }
}

export const userService = new UserService();
