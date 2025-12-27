// ChatBubble.tsx
"use client";

import { useState, useRef, useEffect } from "react";
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
  content,
  blockchain_hash,
  status,
  message_status,
  sender,
  onDelete,
  onReact,
}: ChatBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const { user } = useAuthContext();
  const displayStatus = status || message_status;

  const override =
    sender === "me" ? true : sender === "other" ? false : undefined;
  const isMe = override ?? sender_user_id === user?.user?.id;

  const timeStr = new Date(created_at).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Close actions when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowActions(false);
      }
    }

    if (showActions) {
      document.addEventListener("mousedown", onDocClick);
    }

    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showActions]);

  const handleToggleActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("🔧 Chevron clicked, current state:", showActions);
    setShowActions((prev) => !prev);
  };

  return (
    <div
      ref={wrapperRef}
      className={`flex w-full mb-4 px-4 ${
        isMe ? "justify-end" : "justify-start"
      } group relative`}
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
          } ${showActions ? "shadow-xl scale-[1.01]" : ""}`}
        >
          {/* Chevron trigger: only visible on hover */}
          <button
            onClick={handleToggleActions}
            aria-label="Open message options"
            title="Open message options"
            type="button"
            className={`absolute ${
              isMe ? "left-2" : "right-2"
            } top-2 z-10 opacity-0 bg-(--background)/50 group-hover:opacity-100 transition-opacity hover:bg-(--background)/70 rounded-full p-1.5`}
          >
            <svg
              className={`w-4 h-4 ${isMe ? "text-white" : "text-gray-200"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

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

        {/* Actions positioned below bubble (instead of beside) */}
        {showActions && (
          <div
            className={`mt-2 z-30 ${isMe ? "self-end" : "self-start"}`}
            onClick={(e) => e.stopPropagation()}
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
    </div>
  );
}
