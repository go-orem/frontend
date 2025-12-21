"use client";

import { HoverGif } from "../effects";
import { SidebarPanelLoading } from "@/components/sidebar";
import { useConversationContext } from "@/context/ConversationProvider";
import { useConversations } from "@/hooks/useConversations";
import { UIMessage } from "@/types/chat.types";
import { ConversationType, Message } from "@/types/database.types";
import { decryptUIMessage, getErrorMessage, runEffectAsync } from "@/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWS } from "@/context"; // ✅ ADD: Import WebSocket context

// Utility: format ISO date ke "HH:mm" atau "Hari ini"
function formatTime(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface ChatCardProps {
  id: string;
  name: string;
  message: string;
  time: string;
  img: string;
  borderColor?: string;
  onChatClick?: () => void;
}

function ChatCard({
  id,
  name,
  message,
  time,
  img,
  borderColor = "border-gray-300",
  onChatClick,
}: ChatCardProps) {
  return (
    <HoverGif
      gifUrl="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d3oxMHJqNGRteHNnYm9seXdmeGhmZjF1ODU1cTFnNWFrMGdoN3NjZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13sI05qVwRXrVe/giphy.gif"
      onClick={() => onChatClick && onChatClick()}
    >
      <div className="flex p-3 justify-between rounded-xl cursor-pointer transition-colors duration-300 ease-in-out min-w-[300px] hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
        <div className="flex space-x-3 items-center">
          <div className="profile w-12">
            <img
              className={`w-auto aspect-square rounded-full object-cover border-3 ${borderColor} overflow-hidden`}
              src={img}
              alt={name}
              // onError={(e) => {
              //   const img = e.currentTarget as HTMLImageElement;
              //   img.onerror = null;
              //   img.src = "/default-avatar.png";
              // }}
            />
          </div>
          <div>
            <div className="name font-semibold truncate max-w-40">{name}</div>
            <p className="text-sm text-gray-400 truncate max-w-[180px]">
              {message}
            </p>
          </div>
        </div>
        <div>
          <span className="font-light text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </HoverGif>
  );
}

function ChatCardWithDecryption({
  conv,
  conversationKeys,
  onListClick,
}: {
  conv: any;
  conversationKeys: Record<string, string>;
  onListClick?: (chat: any) => void;
}) {
  const [lastMessageText, setLastMessageText] = useState<string>("");

  const lastMsg = conv.last_message;
  const otherUser = conv.other_user;

  const displayName =
    conv.conversation_type === "direct"
      ? otherUser?.public_name || "Unknown"
      : conv.name || "Group Chat";

  const avatar =
    conv.conversation_type === "direct"
      ? otherUser?.avatar_url ||
        `https://api.dicebear.com/7.x/thumbs/svg?seed=${
          otherUser?.public_name || conv.name || "unknown"
        }`
      : conv.profile_url ||
        `https://api.dicebear.com/7.x/thumbs/svg?seed=${
          conv.name || "group-chat"
        }`;

  // Decrypt last message
  useEffect(() => {
    const decrypt = async () => {
      if (!lastMsg || !lastMsg.cipher_text) {
        setLastMessageText("");
        return;
      }

      const conversationKey = conversationKeys[conv.id];
      if (!conversationKey) {
        setLastMessageText("[No key]");
        return;
      }

      try {
        const plaintext = await decryptUIMessage(
          {
            id: lastMsg.id,
            conversation_id: conv.id,
            cipher_text: lastMsg.cipher_text,
            nonce: lastMsg.nonce,
            tag: lastMsg.tag,
          } as UIMessage,
          conversationKey
        );
        setLastMessageText(plaintext);
      } catch (err) {
        console.error("Failed to decrypt last message:", err);
        setLastMessageText("[Encrypted]");
      }
    };

    decrypt();
  }, [lastMsg, conv.id, conversationKeys]);

  return (
    <ChatCard
      id={conv.id}
      name={displayName}
      message={lastMessageText}
      time={lastMsg?.created_at ? formatTime(lastMsg.created_at) : ""}
      img={avatar}
      borderColor="border-green-500"
      onChatClick={() => onListClick && onListClick(conv)}
    />
  );
}

export default function ListChat({
  type,
  onListClick,
}: {
  type: string;
  onListClick?: (chat: any) => void;
}) {
  const { conversations, loading, conversationKeys } = useConversationContext();
  const { refreshConversations } = useConversations();
  const ws = useWS(); // ✅ ADD: Get WebSocket context

  // Fetch initial conversations
  useEffect(() => {
    runEffectAsync(async () => {
      try {
        await refreshConversations(
          type === "chat" ? null : (type as ConversationType)
        );
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }, [type]);

  // ✅ ADD: Subscribe to all conversation rooms untuk realtime updates
  useEffect(() => {
    if (!ws.connected || conversations.length === 0) return;

    console.log(`📡 Subscribing to ${conversations.length} conversation rooms`);

    // Subscribe ke setiap conversation
    conversations.forEach((conv) => {
      ws.subscribe(`conversation:${conv.id}`);
    });

    // Cleanup: unsubscribe on unmount or when list changes
    return () => {
      conversations.forEach((conv) => {
        ws.unsubscribe(`conversation:${conv.id}`);
      });
    };
  }, [ws.connected, conversations.map((c) => c.id).join(",")]); // ✅ Smart dependency

  if (loading) return <SidebarPanelLoading />;

  return (
    <div className="container h-screen overflow-y-auto pl-3 pr-3 space-y-2">
      {conversations.map((conv) => (
        <ChatCardWithDecryption
          key={conv.id}
          conv={conv}
          conversationKeys={conversationKeys}
          onListClick={onListClick}
        />
      ))}
    </div>
  );
}
