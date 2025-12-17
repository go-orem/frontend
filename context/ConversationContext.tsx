"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ConversationWithLastMessage, Message } from "@/types/database.types";
import { useWebSocket } from "@/hooks/useWebSocket";

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

  const ws = useWebSocket([], (event) => {
    try {
      switch (event.type) {
        case "message_created": {
          const msg: Message = event.message;
          setMessages((prev) => ({
            ...prev,
            [msg.conversation_id]: [...(prev[msg.conversation_id] || []), msg],
          }));
          setConversations((prev) =>
            prev.map((c) =>
              c.id === msg.conversation_id ? { ...c, last_message: msg } : c
            )
          );
          break;
        }
        case "conversation_updated": {
          const conv: ConversationWithLastMessage = event.conversation;
          setConversations((prev) => {
            const exists = prev.find((c) => c.id === conv.id);
            return exists
              ? prev.map((c) => (c.id === conv.id ? conv : c))
              : [...prev, conv];
          });
          break;
        }
        case "notification":
          console.log("🔔 Notification", event.notification);
          break;
        default:
          console.warn("⚠️ Unknown WS event", event);
          break;
      }
    } catch (err) {
      console.error("❌ Error handling WS event", err);
    }
  });

  // auto-subscribe ke semua conversation dengan debounce di hook
  useEffect(() => {
    conversations.forEach((c) => {
      ws.subscribe(`conversation:${c.id}`);
    });
  }, [conversations]);

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
