// MessageList.tsx
"use client";

import { useEffect, useRef } from "react";
import { UIMessage } from "@/types/chat.types";
import { useConversationContext } from "@/context/ConversationProvider";
import { ChatBubble } from "./ChatBubble";
import { PollBubble } from "./PollBubble";

interface MessageListProps {
  messages: UIMessage[];
  currentUserId?: string;
  onDeleteMessage?: (messageId: string) => Promise<void>;
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
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {list.map((msg) => (
        <div key={msg.id}>
          {/* ✅ Check if message is poll or regular */}
          {isPollMessage(msg.cipher_text) ? (
            <PollBubble
              message={msg}
              isMe={msg.sender_user_id === currentUserId}
            />
          ) : (
            <ChatBubble
              {...msg}
              sender={msg.sender_user_id === currentUserId ? "me" : "other"}
              onDelete={() => onDeleteMessage?.(msg.id)}
              onReact={(emoji) => onAddReaction?.(msg.id, emoji)}
            />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

// ✅ Helper: detect if message is poll
function isPollMessage(cipherText: string | number[] | null): boolean {
  if (!cipherText || typeof cipherText !== "string") return false;
  try {
    const parsed = JSON.parse(cipherText);
    return parsed?.type === "poll";
  } catch {
    return false;
  }
}
