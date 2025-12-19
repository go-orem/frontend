"use client";

import React, { createContext, useContext, useState } from "react";
import { ConversationWithLastMessage } from "@/types/database.types";
import { UIMessage } from "@/types/chat.types";

interface ConversationContextType {
  conversations: ConversationWithLastMessage[];
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationWithLastMessage[]>
  >;

  // ✅ PENTING: State untuk UIMessage[], bukan UIMessage
  messages: Record<string, UIMessage[]>;
  setMessages: React.Dispatch<
    React.SetStateAction<Record<string, UIMessage[]>>
  >;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  conversationKeys: Record<string, string>; // ✅ NEW
  setConversationKeys: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<
    ConversationWithLastMessage[]
  >([]);
  const [messages, setMessages] = useState<Record<string, UIMessage[]>>({}); // ✅ FIX: Add []
  const [loading, setLoading] = useState(false);
  const [conversationKeys, setConversationKeys] = useState<
    Record<string, string>
  >({});

  const value: ConversationContextType = {
    conversations,
    setConversations,
    messages,
    setMessages,
    loading,
    setLoading,
    conversationKeys,
    setConversationKeys,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversationContext() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversationContext must be used within ConversationProvider"
    );
  }
  return context;
}
