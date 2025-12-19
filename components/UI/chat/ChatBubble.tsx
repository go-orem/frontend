// ChatBubble.tsx
"use client";

import { useState, useEffect } from "react";
import { UIMessage } from "@/types/chat.types";
import { CheckIcon } from "./CheckIcon";
import { MessageActions } from "./MessageActions";
import { useAuthContext } from "@/context/AuthProvider";
import { useConversationContext } from "@/context/ConversationProvider"; // ✅ NEW
import { decryptUIMessage } from "@/utils/crypto"; // ✅ NEW

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
  cipher_text,
  nonce, // ✅ ADD: Get from props
  tag, // ✅ ADD: Get from props
  status,
  message_status,
  sender,
  onDelete,
  onReact,
}: ChatBubbleProps) {
  const [hovered, setHovered] = useState(false);
  const [decryptedText, setDecryptedText] = useState<string>("");
  const { user } = useAuthContext();
  const { conversationKeys } = useConversationContext();
  const displayStatus = status || message_status;

  const override =
    sender === "me" ? true : sender === "other" ? false : undefined;
  const isMe = override ?? sender_user_id === user?.user?.id;

  const timeStr = new Date(created_at).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ✅ FIX: Pass actual nonce & tag
  useEffect(() => {
    const decrypt = async () => {
      const conversationKey = conversationKeys[conversation_id];
      if (!conversationKey) {
        setDecryptedText("[No encryption key]");
        return;
      }

      // ✅ DEBUG: Log raw data
      console.log("🔐 Attempting decrypt:", {
        msgId: id.substring(0, 8),
        hasCipher: !!cipher_text,
        hasNonce: !!nonce,
        hasTag: !!tag,
        hasKey: !!conversationKey,
      });

      try {
        const plaintext = await decryptUIMessage(
          {
            id,
            conversation_id,
            cipher_text,
            nonce,
            tag,
          } as UIMessage,
          conversationKey
        );
        console.log("✅ Decrypt success:", id.substring(0, 8));
        setDecryptedText(plaintext);
      } catch (err: any) {
        console.log("❌ Decrypt error:", {
          msgId: id.substring(0, 8),
          error: err.message,
        });
        setDecryptedText(`[${err.message}]`);
      }
    };

    decrypt();
  }, [id, conversation_id, cipher_text, nonce, tag, conversationKeys]); // ✅ ADD: nonce & tag deps

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
              ? "bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-br-md shadow-lg"
              : "bg-gray-800/90 backdrop-blur-sm text-gray-100 rounded-bl-md shadow-md border border-white/5"
          } ${hovered ? "shadow-xl scale-[1.01]" : ""}`}
        >
          {/* ✅ UPDATED: Show decrypted text */}
          <div className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[15px]">
            {decryptedText || (
              <span className="text-gray-400 italic">Decrypting...</span>
            )}
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
