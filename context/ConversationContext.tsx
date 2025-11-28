// app/providers/ConversationProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Conversation, Message } from "@/types/database.types";
import { conversationService } from "@/services/conversationService";
import { useAuth } from "@/hooks/useAuth";

interface ConversationContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  loading: boolean;
  refreshConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  createConversation: (memberIds: string[]) => Promise<Conversation | null>;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  // initial load
  useEffect(() => {
    if (isLoggedIn) {
      refreshConversations();
    }
  }, []);

  async function refreshConversations() {
    setLoading(true);
    try {
      const data = await conversationService.listUserConversations();
      setConversations(data);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(conversationId: string) {
    setLoading(true);
    try {
      const data = await conversationService.listMessages(conversationId);
      setMessages((prev) => ({ ...prev, [conversationId]: data }));
    } finally {
      setLoading(false);
    }
  }

  async function createConversation(memberIds: string[]) {
    setLoading(true);
    try {
      const conv = await conversationService.createWithMembers(memberIds);
      setConversations((prev) => [...prev, conv]);
      return conv;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        messages,
        loading,
        refreshConversations,
        loadMessages,
        createConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export const useConversation = () => {
  const ctx = useContext(ConversationContext);
  if (!ctx)
    throw new Error("useConversation must be used within ConversationProvider");
  return ctx;
};
