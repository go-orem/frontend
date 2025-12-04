"use client";

import { useConversations } from "@/hooks/useConversation";
import { HoverGif } from "../effects";
import { SidebarPanelLoading } from "@/components/sidebar";
import { useEffect } from "react";

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
      <div className="flex p-3 justify-between rounded-xl cursor-pointer transition-colors duration-300 ease-in-out min-w-[300px] hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex space-x-3 items-center">
          <div className="profile w-12">
            <img
              className={`w-auto aspect-square rounded-full object-cover border-3 ${borderColor}`}
              src={img}
              alt={name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
          </div>
          <div>
            <div className="name font-semibold truncate max-w-[160px]">
              {name}
            </div>
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

export default function ListChat({
  onListClick,
}: {
  onListClick?: (chat: any) => void;
}) {
  const { conversations, loading } = useConversations("with-last-message");

  useEffect(() => {
    console.log("conversations", conversations);
  }, [conversations]);

  if (loading) return <SidebarPanelLoading />;

  return (
    <div className="container h-screen overflow-y-auto pl-3 pr-3 space-y-2">
      {conversations.map((conv) => {
        const lastMsg = conv.last_message;
        const otherUser = conv.other_user;

        // Tentukan nama & avatar
        const displayName =
          conv.conversation_type === "direct"
            ? otherUser?.public_name || "Unknown"
            : conv.name || "Group Chat";

        const avatar =
          conv.conversation_type === "direct"
            ? otherUser?.avatar_url || "/default-avatar.png"
            : conv.profile_url || "/default-group.png";

        return (
          <ChatCard
            key={conv.id}
            id={conv.id}
            name={displayName}
            message={lastMsg?.cipher_text ? atob(lastMsg.cipher_text) : ""}
            time={lastMsg?.created_at ? formatTime(lastMsg.created_at) : ""}
            img={avatar}
            borderColor="border-green-500"
            onChatClick={() => onListClick && onListClick(conv)}
          />
        );
      })}
    </div>
  );
}
