"use client";

import { useEffect, useState } from "react";
import { conversationService } from "@/services/conversationService";
import { ConversationWithLastMessage } from "@/types/database.types";

type ConversationType = "public" | "user" | "with-last-message";

export function useConversations(type: ConversationType = "user") {
  const [conversations, setConversations] = useState<
    ConversationWithLastMessage[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let data: ConversationWithLastMessage[];
        switch (type) {
          case "public":
            data = await conversationService.listPublic();
            break;
          case "with-last-message":
            data = await conversationService.listWithLastMessage();
            break;
          default:
            data = await conversationService.listUserConversations();
        }
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
