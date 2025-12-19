// ChatBubble.tsx
"use client";

import { useState } from "react";
import { UIMessage } from "@/types/chat.types";
import { CheckIcon } from "./CheckIcon";
import { MessageActions } from "./MessageActions";
import { useAuthContext } from "@/context/AuthProvider";

interface ChatBubbleProps extends UIMessage {
  sender?: "me" | "other";
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export function ChatBubble({
  id,
  sender_user_id,
  sender_name = "Unknown",
  sender_username,
  sender_avatar,
  created_at,
  cipher_text,
  status,
  message_status,
  sender,
  onDelete,
  onReact,
}: ChatBubbleProps) {
  const [hovered, setHovered] = useState(false);
  const { user } = useAuthContext();
  const displayStatus = status || message_status;

  const override =
    sender === "me" ? true : sender === "other" ? false : undefined;
  const isMe = override ?? sender_user_id === user?.user?.id;

  const timeStr = new Date(created_at).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex w-full mb-4 px-4 ${
        isMe ? "justify-end" : "justify-start"
      } group relative`} // ✅ ADD: relative for positioning context
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      {!isMe && (
        <div className="flex-shrink-0 mr-3">
          {sender_avatar ? (
            <img
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
              src={sender_avatar}
              alt={sender_name}
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/10">
              {sender_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div
        className={`relative flex flex-col max-w-[70%] md:max-w-[60%] ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        {/* Name + @username */}
        {!isMe && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-sm font-semibold text-white">
              {sender_name}
            </span>
            {sender_username && (
              <span className="text-xs text-gray-400">@{sender_username}</span>
            )}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl transition-all ${
            isMe
              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md shadow-lg"
              : "bg-gray-800/90 backdrop-blur-sm text-gray-100 rounded-bl-md shadow-md border border-white/5"
          } ${hovered ? "shadow-xl scale-[1.01]" : ""}`} // ✅ REDUCED: scale from 1.02 to 1.01
        >
          <div className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">
            {cipher_text}
          </div>

          {/* Time + Status */}
          <div
            className={`flex items-center gap-1.5 mt-1 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`text-[11px] ${
                isMe ? "text-blue-100/70" : "text-gray-400"
              }`}
            >
              {timeStr}
            </span>
            {isMe && (
              <div className="flex items-center">
                <CheckIcon status={displayStatus} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Actions positioning with proper z-index */}
      {hovered && (
        <div
          className={`absolute z-20 ${
            isMe
              ? "right-4 top-1/2 -translate-y-1/2"
              : "left-16 top-1/2 -translate-y-1/2"
          }`}
          onMouseEnter={() => setHovered(true)} // ✅ Keep hover when on actions
          onMouseLeave={() => setHovered(false)}
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
