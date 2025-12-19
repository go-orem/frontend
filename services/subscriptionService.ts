"use client";

import { handleResponse } from "@/utils/response";
import { Subscription } from "@/types/database.types";

class SubscriptionService {
  async subscribe(payload: {
    plan: string;
    duration: number;
  }): Promise<Subscription> {
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async getActive(): Promise<Subscription> {
    const res = await fetch("/api/subscriptions/active", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }
}

export const subscriptionService = new SubscriptionService();
