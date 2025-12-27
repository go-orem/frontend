"use client";
import React, { useEffect, useState } from "react";
import { ChatWindow, HeaderSplit } from "../UI";
import { InfoSidebar } from "../pages/chat";
import {
  useAuth,
  useConversationDetail,
  useConversations,
  useMessage,
} from "@/hooks";
import { useConversationContext } from "@/context/ConversationProvider";
import { useWS } from "@/context";
import { toUIMessage } from "@/types/chat.types";

export default function MainContent({ channelId }: { channelId: string }) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { detail: detailConv } = useConversationDetail(channelId);
  const { user } = useAuth();
  const ws = useWS();

  // 🎯 Message hooks
  const { sendMessage, addReaction, deleteMessage, updateStatus } = useMessage(
    user?.user?.id || ""
  );
  const { markConversationAsRead, loadMessages } = useConversations();

  // 🎯 Get messages from context
  const { messages, setMessages } = useConversationContext();
  const currentMessages = messages[channelId] ?? [];

  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved === "true") {
      setOpenSidebar(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", openSidebar.toString());
  }, [openSidebar]);

  // 🔔 Load messages & mark as read
  useEffect(() => {
    if (channelId && user) {
      // Load messages dari backend
      loadMessages(channelId, { skipIfCached: true }).catch(console.error);
      // Mark all as read
      markConversationAsRead(channelId).catch(console.error);
    }
  }, [channelId, user]);

  // 📡 Subscribe to conversation room for realtime updates
  useEffect(() => {
    if (!channelId || !ws.connected || !user?.user?.id) return;

    const currentUserId = user.user.id;
    const room = `conversation:${channelId}`;
    console.log("📡 MainContent subscribing to room:", room);
    ws.subscribe(room);

    // ✅ Listen to message_created event
    const handleWSEvent = (event: any) => {
      if (event.type === "message_created" && event.message) {
        const message = event.message;

        // Only process messages for current conversation
        if (message.conversation_id !== channelId) return;

        // ✅ SKIP our own messages (already handled by optimistic update)
        if (message.sender_user_id === currentUserId) {
          console.log("⚠️ Skipping own message from WebSocket:", message.id);
          return;
        }

        console.log("✅ New message from other user:", message.id);

        // Update messages in context
        setMessages((prev) => {
          const currentMessages = prev[channelId] || [];

          // Check if message already exists
          if (currentMessages.some((m) => m.id === message.id)) {
            console.log("⚠️ Message already exists, skipping:", message.id);
            return prev;
          }

          // Add message from other users
          return {
            ...prev,
            [channelId]: [...currentMessages, toUIMessage(message)],
          };
        });
      }
    };

    ws.addEventListener(handleWSEvent);

    // Cleanup
    return () => {
      console.log("📡 MainContent unsubscribing from room:", room);
      ws.unsubscribe(room);
      ws.removeEventListener(handleWSEvent);
    };
  }, [channelId, ws.connected, ws, setMessages, user?.user?.id]);

  if (!user || !user.user || !detailConv) return null;
  const currentUserId = user.user.id;

  const userData = {
    avatar:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3JpMzBob2Nha3A2eG9xa2pocWh1ZGs2YjczMXB0eXpzN3Vyam1nZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1zhqIaTw4q3ZeuDq8i/giphy.gif",
    cover:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjk5Z2ZyYnp0N2UzbWdtaWp4dmpjcXRxb3VyNzlkMW50NjQ0ZHduZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/z7wIVXPnpm1DiJDdsU/giphy.gif",
    name: "Syarifa 🦋🐥🐝",
    status: "@syarifa",
    bio: "Teruskan kerja keras kamu sampai bisa, membeli rumah impian lo dengan caranya sendiri, dengan skill yang mumpuni 🦋🐥🐝",
    members: [
      {
        name: "Febri Riyan",
        avatar:
          "https://i.pinimg.com/474x/ce/cc/5a/cecc5a1270bac97d96f222ceffbd695f.jpg",
      },
      {
        name: "Syarifa",
        avatar:
          "https://i.pinimg.com/474x/8a/ce/d3/8aced384f4491bfcc0e68d0ff1a9fb77.jpg",
      },
    ],
    mediaItems: [
      {
        src: "https://i.pinimg.com/474x/b3/23/9d/b3239d8a6ce737fe1c0997d68c40dc6c.jpg",
        alt: "Media 1",
      },
      {
        src: "https://i.pinimg.com/474x/81/97/95/819795633bb655204b3022097ba53e5a.jpg",
        alt: "Media 2",
      },
      {
        src: "https://i.pinimg.com/474x/ce/cc/5a/cecc5a1270bac97d96f222ceffbd695f.jpg",
        alt: "Media 3",
      },
      {
        src: "https://i.pinimg.com/474x/c7/b2/5e/c7b25ec9fc7944794afbc6a1a13414a4.jpg",
        alt: "Media 1",
      },
      {
        src: "https://i.pinimg.com/474x/30/1a/9d/301a9d6b0f219674500b8ce89ab5ea88.jpg",
        alt: "Media 2",
      },
      {
        src: "https://i.pinimg.com/474x/13/3d/a6/133da6735d9f7fabb78ae11fd9caf4cb.jpg",
        alt: "Media 3",
      },
    ],
    files: ["Dokumen.pdf", "Proposal.docx"],
    voice: ["Voice 1", "Voice 2"],
    links: ["https://bloop.id", "https://discord.com"],
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div
        className={`flex flex-col transition-all duration-300 ${
          openSidebar
            ? "w-0 opacity-0 overflow-hidden lg:opacity-100 lg:w-[calc(100%-350px)]"
            : "w-full opacity-100"
        }`}
      >
        <HeaderSplit
          currentUserId={currentUserId}
          detail={detailConv}
          onProfileClick={() => setOpenSidebar(!openSidebar)}
        />

        <div className="flex-1 overflow-auto">
          <ChatWindow
            conversationId={channelId}
            currentUserId={currentUserId}
            messages={currentMessages}
            onSendMessage={sendMessage}
            onDeleteMessage={deleteMessage}
            onAddReaction={addReaction}
            onUpdateStatus={updateStatus}
          />
        </div>
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          openSidebar ? "max-w-[350px] opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        <div className="w-auto border-l border-gray-700 bg-[--background] h-full">
          <InfoSidebar
            variant="user"
            data={userData}
            onClose={() => setOpenSidebar(false)}
          />
        </div>
      </div>
    </div>
  );
}
