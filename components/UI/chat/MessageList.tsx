// MessageList.tsx
"use client";

import { useEffect, useRef } from "react";
import { useConversationContext } from "@/context/ConversationProvider";
import { useAuth } from "@/hooks";
import { ChatBubble } from "./ChatBubble";

export function MessageList({ conversationId }: { conversationId: string }) {
  const { messages } = useConversationContext();
  const { user } = useAuth();
  const list = messages[conversationId] || [];
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [list.length]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {list.map((msg) => (
        <ChatBubble
          key={msg.id}
          message={msg}
          isMe={msg.sender_user_id === user?.user.id}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}
