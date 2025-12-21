"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UIMessage } from "@/types/chat.types";
import { ConversationWithLastMessage, Message } from "@/types/database.types";
import { toUIMessage } from "@/types/chat.types";
import { useWebSocket } from "@/hooks/useWebSocket";

type ConversationContextType = {
  conversations: ConversationWithLastMessage[];
  messages: Record<string, UIMessage[]>;
  conversationKeys: Record<string, string>;
  loading: boolean;
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationWithLastMessage[]>
  >;
  setMessages: React.Dispatch<
    React.SetStateAction<Record<string, UIMessage[]>>
  >;
  setConversationKeys: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

const STORAGE_KEY_PREFIX = "orem_conv_key_";

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<
    ConversationWithLastMessage[]
  >([]);
  const [messages, setMessages] = useState<Record<string, UIMessage[]>>({});
  const [conversationKeys, setConversationKeysState] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);

  const ws = useWebSocket();

  // ✅ Load keys from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadedKeys: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        const convId = key.replace(STORAGE_KEY_PREFIX, "");
        const storedKey = localStorage.getItem(key);
        if (storedKey) {
          loadedKeys[convId] = storedKey;
        }
      }
    }

    if (Object.keys(loadedKeys).length > 0) {
      console.log(
        "🔑 Loaded conversation keys from localStorage:",
        Object.keys(loadedKeys)
      );
      setConversationKeysState(loadedKeys);
    }
  }, []);

  // ✅ Wrapper to persist keys to localStorage
  const setConversationKeys = (
    updater:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => {
    setConversationKeysState((prev) => {
      const newKeys = typeof updater === "function" ? updater(prev) : updater;

      // Persist to localStorage
      if (typeof window !== "undefined") {
        Object.entries(newKeys).forEach(([convId, key]) => {
          if (key && !prev[convId]) {
            localStorage.setItem(`${STORAGE_KEY_PREFIX}${convId}`, key);
            console.log("💾 Saved conversation key to localStorage:", convId);
          }
        });
      }

      return newKeys;
    });
  };

  // ✅ Register WebSocket event listener
  useEffect(() => {
    const handleWSEvent = (event: any) => {
      if (event.type === "message_created" && event.message) {
        const newMessage = event.message as Message;
        const conversationId = newMessage.conversation_id;

        console.log("🔔 ConversationProvider: New message via WS", {
          msgId: newMessage.id,
          convId: conversationId,
        });

        // ✅ FIX: Check duplicate by actual ID (not client_id)
        setMessages((prev) => {
          const existing = prev[conversationId] || [];

          // Check if message with same ID already exists
          const isDuplicate = existing.some((m) => m.id === newMessage.id);

          if (isDuplicate) {
            console.log(
              "⚠️ Message already exists (duplicate from backend response), skipping WS update"
            );
            return prev;
          }

          // Also check if this is replacing an optimistic message
          const optimisticIndex = existing.findIndex(
            (m) => m.client_id && m.client_id.startsWith("client-")
          );

          if (optimisticIndex !== -1) {
            console.log(
              "⚠️ Optimistic message will be replaced by backend response, skipping WS update"
            );
            return prev;
          }

          console.log("✅ Adding new message from WebSocket");
          return {
            ...prev,
            [conversationId]: [...existing, toUIMessage(newMessage)],
          };
        });

        // Update conversations list
        setConversations((prev) => {
          const index = prev.findIndex((c) => c.id === conversationId);
          if (index === -1) {
            console.log("⚠️ Conversation not in list");
            return prev;
          }

          console.log("✅ Updating conversation list with new last_message");
          const updated = [...prev];
          const conv = { ...updated[index], last_message: newMessage };
          updated.splice(index, 1);
          updated.unshift(conv);
          return updated;
        });
      }
    };

    ws.addEventListener(handleWSEvent);

    return () => {
      ws.removeEventListener(handleWSEvent);
    };
  }, [ws, setMessages, setConversations]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        messages,
        conversationKeys,
        loading,
        setConversations,
        setMessages,
        setConversationKeys,
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
