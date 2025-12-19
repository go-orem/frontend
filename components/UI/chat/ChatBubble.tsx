// ChatBubble.tsx
"use client";

import { useState } from "react";
import { UIMessage } from "@/types/chat.types";
import { CheckIcon } from "./CheckIcon";
import { MessageActions } from "./MessageActions";

interface ChatBubbleProps extends UIMessage {
  sender?: "me" | "other";
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

/**
 * Individual message bubble component
 * Displays message content, avatar, time, status, and actions
 */
export function ChatBubble({
  id,
  sender_user_id,
  sender_name = "Unknown",
  sender_avatar,
  created_at,
  cipher_text,
  status,
  message_status,
  sender = "other",
  onDelete,
  onReact,
}: ChatBubbleProps) {
  const [hovered, setHovered] = useState(false);
  const isMe = sender === "me";

  // Use status alias jika ada, fallback ke message_status
  const displayStatus = status || message_status;

  // Format time
  const timeStr = new Date(created_at).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex w-full mb-3 pl-2.5 pr-2.5 ${
        isMe ? "justify-end" : "justify-start"
      } group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar (Left side for others) */}
      {!isMe && sender_avatar && (
        <div className="profile mr-3 flex-shrink-0">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={sender_avatar}
            alt={sender_name}
            loading="lazy"
          />
        </div>
      )}

      <div className="relative flex flex-col items-end max-w-xs md:max-w-md">
        {/* Header: Name + Time */}
        {!isMe && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-semibold text-white">
              {sender_name}
            </span>
            <span className="text-xs text-gray-500">{timeStr}</span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`px-4 py-2 rounded-2xl text-sm relative transition-all ${
            isMe
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-700 text-gray-100 rounded-bl-none"
          } ${hovered ? "shadow-lg" : ""}`}
        >
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {cipher_text}
          </div>

          {/* Status Icon (Right side for own messages) */}
          {isMe && (
            <div className="flex items-center justify-end mt-1">
              <CheckIcon status={displayStatus} />
            </div>
          )}
        </div>

        {/* Time (Right side for own messages) */}
        {isMe && <span className="text-xs text-gray-500 mt-1">{timeStr}</span>}
      </div>

      {/* Actions (Show on hover) */}
      {hovered && (
        <div
          className={isMe ? "absolute right-0 mr-2" : "absolute left-0 ml-2"}
        >
          <MessageActions
            messageId={id}
            isMe={isMe}
            onDelete={onDelete}
            onReact={onReact}
          />
        </div>
      )}
    </div>
  );
}
