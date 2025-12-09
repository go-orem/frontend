"use client";

import { createContext, useContext, useState } from "react";
import { ConversationWithLastMessage, Message } from "@/types/database.types";

interface ConversationContextType {
  conversations: ConversationWithLastMessage[];
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationWithLastMessage[]>
  >;

  messages: Record<string, Message[]>;
  setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;

  loading: boolean;
  setLoading: (val: boolean) => void;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<
    ConversationWithLastMessage[]
  >([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);

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

export const useConversationContext = () => {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error("ConversationProvider missing");
  return ctx;
};
