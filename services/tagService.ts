"use client";

import { handleResponse } from "@/utils/response";
import { Tag } from "@/types/database.types";

class TagService {
  async list(): Promise<Tag[]> {
    const res = await fetch("/api/tags", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async create(name: string): Promise<Tag> {
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/tags/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }
}

export const tagService = new TagService();
