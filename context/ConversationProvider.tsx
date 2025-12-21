"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UIMessage } from "@/types/chat.types";
import { ConversationWithLastMessage } from "@/types/database.types";

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
            // Only save new keys
            localStorage.setItem(`${STORAGE_KEY_PREFIX}${convId}`, key);
            console.log("💾 Saved conversation key to localStorage:", convId);
          }
        });
      }

      return newKeys;
    });
  };

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
