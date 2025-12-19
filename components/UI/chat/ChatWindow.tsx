"use client";

import { useState } from "react";
import ChatFooter from "./ChatFooter";
import { useModalChat } from "@/context";
import { SendChatAttachment, PollComposer } from "@/components/UI";
import { UIMessage } from "@/types/chat.types";
import { MessageStatus } from "@/types/database.types";
import { MessageList } from "./MessageList";

type ChatWindowProps = {
  conversationId?: string;
  currentUserId?: string;
  messages?: UIMessage[];
  onSendMessage?: (conversationId: string, text: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onAddReaction?: (messageId: string, emoji: string) => Promise<void>;
  onUpdateStatus?: (messageId: string, status: MessageStatus) => Promise<void>;
};

/**
 * Main chat window component
 * Orchestrates message display, input, and actions
 */
export default function ChatWindow({
  conversationId,
  currentUserId,
  messages: propsMessages = [],
  onSendMessage,
  onDeleteMessage,
  onAddReaction,
  onUpdateStatus,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const { openModalChat, setOpenModalChat } = useModalChat();
  const [openPollComposer, setOpenPollComposer] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    try {
      await onSendMessage?.(conversationId, input);
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSendPoll = async (pollData: {
    question: string;
    options: string[];
  }) => {
    if (!conversationId) return;

    try {
      // Encrypt poll as JSON message
      const pollJson = JSON.stringify({
        type: "poll",
        question: pollData.question,
        options: pollData.options.map((opt) => ({ text: opt, votes: 0 })),
      });

      await onSendMessage?.(conversationId, pollJson);
      setOpenPollComposer(false);
    } catch (err) {
      console.error("Failed to send poll:", err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await onDeleteMessage?.(messageId);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleReact = async (messageId: string, emoji: string) => {
    try {
      await onAddReaction?.(messageId, emoji);
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-[url('https://i.pinimg.com/736x/c6/69/0c/c6690caf0ff598a60ae714931b491f62.jpg')] bg-cover bg-center">
      {/* Message List */}
      <MessageList
        messages={propsMessages}
        currentUserId={currentUserId}
        onDeleteMessage={handleDeleteMessage}
        onAddReaction={handleReact}
      />

      {/* Chat Footer */}
      <div
        className={`transition-all duration-300 ${
          openModalChat ? "mb-80" : "mb-0"
        }`}
      >
        <ChatFooter
          input={input}
          setInput={setInput}
          sendMessage={handleSendMessage}
        />
      </div>

      {/* Attachment Modal */}
      <SendChatAttachment
        open={openModalChat}
        onClose={() => setOpenModalChat(false)}
        onOpenPoll={() => {
          setOpenModalChat(false);
          setOpenPollComposer(true);
        }}
      />

      {/* Poll Composer Modal */}
      <PollComposer
        open={openPollComposer}
        onClose={() => setOpenPollComposer(false)}
        onSend={handleSendPoll}
      />
    </div>
  );
}
