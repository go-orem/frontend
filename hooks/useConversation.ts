"use client";

import { useEffect, useState } from "react";
import { conversationService } from "@/services/conversationService";
import { Conversation } from "@/types/database.types";

export function useConversations(type: "public" | "user" = "user") {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const data =
          type === "public"
            ? await conversationService.listPublic()
            : await conversationService.listUserConversations();
        setConversations(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  return { conversations, loading, error };
}
