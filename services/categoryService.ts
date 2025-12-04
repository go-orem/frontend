"use client";

import { handleResponse } from "@/utils/response";
import { Category } from "@/types/database.types";

class CategoryService {
  async list(): Promise<Category[]> {
    const res = await fetch("/api/categories", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }

  async create(name: string): Promise<Category> {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }
}

export const categoryService = new CategoryService();
