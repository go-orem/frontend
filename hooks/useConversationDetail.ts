import { useState, useEffect } from "react";
import { conversationService } from "@/services/conversationService";
import { Conversation, ConversationMember } from "@/types/database.types";

export interface ConversationDetail {
  conversation: Conversation;
  members: ConversationMember[];
  tags: { id: string; name: string }[];
}

export function useConversationDetail(conversationId: string | null) {
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    setLoading(true);
    setError(null);

    conversationService
      .getConversationDetail(conversationId)
      .then((data) => setDetail(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [conversationId]);

  return { detail, loading, error };
}
