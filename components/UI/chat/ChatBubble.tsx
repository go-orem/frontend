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
  conversation_id,
  sender_user_id,
  sender_name = "Unknown",
  sender_username,
  sender_avatar,
  created_at,
  content, // ✅ Plain text content instead of cipher_text
  blockchain_hash, // ✅ Show blockchain verification badge
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
      } group relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      {!isMe && (
        <div className="shrink-0 mr-3">
          <img
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
            src={
              sender_avatar ||
              `https://api.dicebear.com/7.x/thumbs/svg?seed=${sender_name}`
            }
            alt={sender_name}
            loading="lazy"
          />
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
              ? "bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-br-none shadow-lg"
              : "bg-gray-800/90 backdrop-blur-sm text-gray-100 rounded-tl-none shadow-md border border-white/5"
          } ${hovered ? "shadow-xl scale-[1.01]" : ""}`}
        >
          {/* ✅ Plain text content - no decryption needed */}
          <div className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[15px]">
            {content || (
              <span className="text-gray-400 italic">Empty message</span>
            )}
          </div>

          {/* Time + Status + Blockchain Badge */}
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

            {/* ✅ Blockchain verification badge */}
            {blockchain_hash && (
              <span
                className="text-[10px] text-green-400 flex items-center gap-0.5"
                title={`Verified on blockchain\nHash: ${blockchain_hash.substring(
                  0,
                  16
                )}...`}
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}

            {isMe && (
              <div className="flex items-center">
                <CheckIcon status={displayStatus} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {hovered && (
        <div
          className={`absolute z-20 ${
            isMe
              ? "right-4 top-1/2 -translate-y-1/2"
              : "left-16 top-1/2 -translate-y-1/2"
          }`}
          onMouseEnter={() => setHovered(true)}
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
