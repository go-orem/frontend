"use client";

import { useState, useRef, useEffect } from "react";
import ChatFooter from "./ChatFooter";
import { useModal, useModalChat } from "@/context";
import { SendChatAttachment } from "@/components/UI";
import { FullChatProps } from "@/types/conversations.type";

type PollMessage = {
  type: "poll";
  question: "string";
  options: { text: string; votes: number }[];
};

function CheckIcon({ status }: { status?: "sent" | "delivered" | "read" }) {
  if (status === "sent") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#aaa"
        viewBox="0 0 24 24"
      >
        <path d="M9 16.17l-3.88-3.88L4 13.41l5 5 10-10-1.41-1.42z" />
      </svg>
    );
  }
  if (status === "delivered") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="#aaa"
        viewBox="0 0 24 24"
      >
        <path d="M9 16.17l-3.88-3.88L4 13.41l5 5 10-10-1.41-1.42z" />
        <path d="M17 16.17l-3.88-3.88L12 13.41l5 5 7-7-1.41-1.42z" />
      </svg>
    );
  }
  if (status === "read") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="#4fc3f7"
        viewBox="0 0 24 24"
      >
        <path d="M9 16.17l-3.88-3.88L4 13.41l5 5 10-10-1.41-1.42z" />
        <path d="M17 16.17l-3.88-3.88L12 13.41l5 5 7-7-1.41-1.42z" />
      </svg>
    );
  }
  return null;
}

function ChatBubble({
  id,
  name,
  avatar,
  time,
  message,
  sender = "other",
  status,
}: FullChatProps) {
  const isMe = sender === "me";
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
      {!isMe && avatar && (
        <div className="profile mr-3">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={avatar}
            alt={name}
          />
        </div>
      )}

      <div className="relative group">
        <div
          className={`flex items-center space-x-2 mb-1 ${
            isMe ? "justify-end" : "justify-start"
          }`}
        >
          <div className="name  text-sm font-semibold">{name}</div>
          <p className=" text-xs text-gray-400">{time}</p>
        </div>

        <div
          className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl  text-sm relative
            ${
              isMe
                ? "bg-gray-800 text-white rounded-br-none"
                : "bg-(--hovercolor) text-gray-100 rounded-bl-none"
            }`}
        >
          <div className="whitespace-pre-wrap wrap-break-word leading-relaxed">
            {typeof message === "object" && (message as any).type === "poll" ? (
              <PollBubble poll={message as PollMessage} isMe={isMe} />
            ) : (
              message
            )}
          </div>

          {isMe && (
            <div className="flex items-center justify-end mt-1">
              <CheckIcon status={status} />
            </div>
          )}
        </div>

        {hovered && (
          <div
            className={`absolute flex space-x-2 px-2 py-1 top-1/2 -translate-y-1/2
            ${isMe ? "right-full mr-2" : "left-full ml-2"}`}
          >
            <button className="text-white transition text-lg cursor-pointer hover:scale-110">
              💬
            </button>
            <button
              onClick={(e) => openModal(id, e.currentTarget)}
              className="text-white transition text-lg cursor-pointer hover:scale-110"
            >
              ⚙️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// === Polling ===
function PollBubble({ poll, isMe }: { poll: PollMessage; isMe: boolean }) {
  const [votedIndex, setVotedIndex] = useState<number | null>(null);

  const totalVotes = poll.options.reduce((a, b) => a + b.votes, 0);

  return (
    <div
      className={`
        relative w-full rounded-2xl px-3 py-2.5 backdrop-blur-xl
        ${
          isMe
            ? "bg-white/8 border border-white/10"
            : "bg-black/45 border border-white/5"
        }
      `}
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[13.5px] font-semibold leading-snug">
          {poll.question}
        </p>

        <span className="text-[10px] uppercase tracking-wider text-gray-400">
          poll
        </span>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {poll.options.map((opt, i) => {
          const percent =
            totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);

          const selected = votedIndex === i;

          return (
            <button
              key={i}
              disabled={votedIndex !== null}
              onClick={() => setVotedIndex(i)}
              className={`
                relative w-full overflow-hidden rounded-xl px-3 py-2
                text-left transition-all duration-200
                ${
                  selected
                    ? "ring-1 ring-(--primarycolor) bg-(--primarycolor)/15"
                    : "hover:bg-white/10"
                }
                ${isMe ? "bg-white/6" : "bg-black/5"}
              `}
            >
              {/* Progress bar */}
              {votedIndex !== null && (
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className="h-full bg-(--primarycolor)/50 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium leading-snug">
                  {opt.text}
                </span>

                {votedIndex !== null && (
                  <span className="text-[12px] font-semibold opacity-80">
                    {percent}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {votedIndex !== null && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5 text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Vote recorded
          </span>

          <span className="opacity-60">hash-ready</span>
        </div>
      )}
    </div>
  );
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<FullChatProps[]>([
    {
      id: 14,
      name: "Saya",
      time: "23:01",
      message: "Kamu sedang melukis ya 🥰 🚀",
      sender: "me",
      status: "delivered",
    },
  ]);

  {
    /* SEND POLL */
  }
  const sendPoll = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "Saya",
        time: new Date().toLocaleTimeString().slice(0, 5),
        sender: "me",
        status: "sent",
        message: {
          type: "poll",
          question: "Makan apa malam ini?",
          options: [
            { text: "Nasi goreng", votes: 0 },
            { text: "Mie ayam", votes: 0 },
            { text: "Bakso", votes: 0 },
          ],
        },
      },
    ]);
  };

  const { openModalChat, setOpenModalChat } = useModalChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: 1,
        name: "Saya",
        time: new Date().toLocaleTimeString().slice(0, 5),
        message: input,
        sender: "me",
        status: "sent",
      },
    ]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex flex-col overflow-x-auto h-screen bg-[url('https://i.pinimg.com/736x/c6/69/0c/c6690caf0ff598a60ae714931b491f62.jpg')] object-cover bg-center">
      {/* CHAT CONTENT */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} {...msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        className={`${
          openModalChat ? "mb-34" : "mb-0"
        } transition-all duration-300`}
      >
        <ChatFooter
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>

      <SendChatAttachment
        open={openModalChat}
        onClose={() => setOpenModalChat(false)}
        onOpenPoll={() => {
          setOpenModalChat(false);
          sendPoll();
        }}
      />
    </div>
  );
}
