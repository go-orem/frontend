// ChatBubble.tsx
"use client";

import { useState } from "react";
import { useModal } from "@/context";
import { Message, MessageStatus } from "@/types/database.types";

function CheckIcon({ status }: { status?: MessageStatus }) {
  if (status === "queued")
    return <span className="text-xs text-gray-400">⏳</span>;
  if (status === "sent") return <span>✓</span>;
  if (status === "delivered") return <span>✓✓</span>;
  if (status === "read") return <span className="text-blue-400">✓✓</span>;
  return null;
}

export function ChatBubble({
  message,
  isMe,
}: {
  message: Message;
  isMe: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { openModal } = useModal();

  return (
    <div
      className={`flex w-full mb-3 pl-2.5 pr-2.5 ${
        isMe ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative group">
        <div className="flex items-center space-x-2 mb-1">
          <div className="text-sm font-semibold">{message.sender_user_id}</div>
          <p className="text-xs text-gray-400">
            {new Date(message.created_at).toLocaleTimeString().slice(0, 5)}
          </p>
        </div>

        <div
          className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm
            ${
              isMe
                ? "bg-gray-800 text-white"
                : "bg-(--hovercolor) text-gray-100"
            }`}
        >
          <div className="whitespace-pre-wrap">{message.cipher_text}</div>

          {isMe && (
            <div className="flex justify-end mt-1">
              <CheckIcon status={message.message_status} />
            </div>
          )}
        </div>

        {hovered && (
          <div className="absolute flex space-x-2 px-2 py-1 top-1/2 -translate-y-1/2 right-full mr-2">
            <button onClick={(e) => openModal(message.id, e.currentTarget)}>
              ⚙️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
