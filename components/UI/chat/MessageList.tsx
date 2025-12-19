// MessageList.tsx
"use client";

import { useEffect, useRef } from "react";
import { UIMessage } from "@/types/chat.types";
import { useConversationContext } from "@/context/ConversationProvider";
import { useAuth } from "@/hooks";
import { ChatBubble } from "./ChatBubble";

interface MessageListProps {
  messages: UIMessage[];
  currentUserId?: string;
  onDeleteMessage?: (messageId: string) => void;
  onAddReaction?: (messageId: string, emoji: string) => Promise<void>;
}

/**
 * Message list container with auto-scroll
 */
export function MessageList({
  messages,
  currentUserId,
  onDeleteMessage,
  onAddReaction,
}: MessageListProps) {
  const { messages: contextMessages } = useConversationContext();
  const { user } = useAuth();
  const list = messages || contextMessages;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll ke bottom saat messages berubah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [list.length]);

  if (!list || list.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-center">
          No messages yet. Start a conversation! 💬
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {list.map((msg) => (
        <ChatBubble
          key={msg.id}
          {...msg}
          sender={msg.sender_user_id === currentUserId ? "me" : "other"}
          onDelete={onDeleteMessage}
          onReact={onAddReaction}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
