"use client";

import { handleResponse } from "@/utils/response";
import { Story } from "@/types/database.types";

class StoryService {
  async createStory(payload: {
    content: string;
    attachments?: any[];
  }): Promise<Story> {
    const res = await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async getActiveStories(): Promise<Story[]> {
    const res = await fetch("/api/stories/active", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }
}

export const storyService = new StoryService();
