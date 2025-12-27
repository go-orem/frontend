"use client";

import React, { createContext, useContext, useState } from "react";
import { UIMessage } from "@/types/chat.types";
import { ConversationWithLastMessage } from "@/types/database.types";

interface ConversationContextType {
  conversations: ConversationWithLastMessage[];
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationWithLastMessage[]>
  >;
  messages: Record<string, UIMessage[]>;
  setMessages: React.Dispatch<
    React.SetStateAction<Record<string, UIMessage[]>>
  >;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [messages, setMessages] = useState<Record<string, UIMessage[]>>({});
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        setConversations,
        messages,
        setMessages,
        loading,
        setLoading,
      }}
    >
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
