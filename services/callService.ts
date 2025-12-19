"use client";

import { handleResponse } from "@/utils/response";

class CallService {
  async startCall(payload: {
    conversation_id: string;
    initiator_id: string;
  }): Promise<Response> {
    const res = await fetch("/api/calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async addParticipant(callId: string, userId: string): Promise<void> {
    const res = await fetch(`/api/calls/${callId}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async endCall(callId: string): Promise<void> {
    const res = await fetch(`/api/calls/${callId}/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return handleResponse(res);
  }
}

export const callService = new CallService();
