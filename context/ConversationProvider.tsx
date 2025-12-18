"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { ConversationWithLastMessage, Message } from "@/types/database.types";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks";
import { UIMessage } from "@/types/chat.types";

interface ConversationContextType {
  conversations: ConversationWithLastMessage[];
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationWithLastMessage[]>
  >;
  messages: Record<string, Message[]>;
  setMessages: React.Dispatch<
    React.SetStateAction<Record<string, UIMessage[]>>
  >;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<
    ConversationWithLastMessage[]
  >([]);
  const [messages, setMessages] = useState<Record<string, UIMessage[]>>({});
  const [loading, setLoading] = useState(false);
  const subscribedRef = useRef<Set<string>>(new Set());

  const ws = useWebSocket((event) => {
    try {
      switch (event.type) {
        case "conversation_updated": {
          const conv: ConversationWithLastMessage = event.conversation;
          setConversations((prev) => {
            const exists = prev.some((c) => c.id === conv.id);
            return exists
              ? prev.map((c) => (c.id === conv.id ? conv : c))
              : [...prev, conv];
          });
          break;
        }

        case "notification":
          console.log("🔔 Notification", event.notification);
          break;

        case "message_created": {
          const msg: UIMessage = event.message;

          setMessages((prev) => {
            const list = prev[msg.conversation_id] || [];

            // 🔁 replace optimistic
            const replaced = list.some((m) => m.client_id === msg.client_id)
              ? list.map((m) => (m.client_id === msg.client_id ? msg : m))
              : [...list, msg];

            return {
              ...prev,
              [msg.conversation_id]: replaced,
            };
          });

          break;
        }

        case "message_read": {
          setMessages((prev) => ({
            ...prev,
            [event.conversation_id]: prev[event.conversation_id].map((m) =>
              m.id === event.message_id ? { ...m, status: "read" } : m
            ),
          }));
          break;
        }

        default:
          console.warn("⚠️ Unknown WS event", event);
      }
    } catch (err) {
      console.error("❌ Error handling WS event", err);
    }
  });

  // subscribe hanya saat WS sudah CONNECTED
  useEffect(() => {
    if (!isAuthenticated || !ws.connected) return;

    conversations.forEach((c) => {
      const room = `conversation:${c.id}`;
      if (!subscribedRef.current.has(room)) {
        ws.subscribe(room);
        subscribedRef.current.add(room);
      }
    });
  }, [conversations, ws.connected, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setConversations([]);
      setMessages({});
    }
  }, [isAuthenticated]);

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
