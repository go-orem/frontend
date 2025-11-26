"use client";

import { useState, useRef, useEffect } from "react";
import ChatFooter from "./ChatFooter";
import { useModal, useModalChat } from "@/context";
import { SendChatAttachment } from "@/components/UI";

type FullChatProps = {
  id: number;
  name: string;
  avatar?: string;
  time: string;
  message: string;
  sender?: "me" | "other";
  status?: "sent" | "delivered" | "read";
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
          <div className="name font-mono text-sm font-semibold">{name}</div>
          <p className="font-mono text-xs text-gray-400">{time}</p>
        </div>

        <div
          className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl font-mono text-sm relative
            ${
              isMe
                ? "bg-gray-800 text-white rounded-br-none"
                : "bg-(--hovercolor) text-gray-100 rounded-bl-none"
            }`}
        >
          <div className="whitespace-pre-wrap wrap-break-word leading-relaxed">
            {message}
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

export default function ChatWindow() {
  const [messages, setMessages] = useState<FullChatProps[]>([
    {
      id: 1,
      name: "Syarifa",
      avatar:
        "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3JpMzBob2Nha3A2eG9xa2pocWh1ZGs2YjczMXB0eXpzN3Vyam1nZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1zhqIaTw4q3ZeuDq8i/giphy.gif",
      time: "23:00",
      message:
        "Halo, lagi apa? Menu hari ini apa ya apakah kamu sudah makan malem ini?",
      sender: "other",
    },
    {
      id: 2,
      name: "Saya",
      time: "23:01",
      message: "Lagi coba bikin chat app 🚀",
      sender: "me",
      status: "sent",
    },
    {
      id: 3,
      name: "Salima",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
      time: "23:00",
      message:
        "Halo, lagi apa? Menu hari ini apa ya apakah kamu sudah makan malem ini?",
      sender: "other",
    },
    {
      id: 4,
      name: "Salima",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
      time: "23:00",
      message:
        "Halo, lagi apa? Menu hari ini apa ya apakah kamu sudah makan malem ini?",
      sender: "other",
    },
    {
      id: 5,
      name: "Saya",
      time: "23:01",
      message: "Kamu sedang melukis ya 🥰 🚀",
      sender: "me",
      status: "read",
    },
    {
      id: 6,
      name: "Ratna sinta 🦋",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
      time: "23:00",
      message:
        "Halo, lagi apa? Menu hari ini apa ya apakah kamu sudah makan malem ini?",
      sender: "other",
    },
    {
      id: 7,
      name: "Saya",
      time: "23:01",
      message: "Kamu sedang melukis ya 🥰 🚀",
      sender: "me",
      status: "delivered",
    },
    {
      id: 8,
      name: "Syarifa",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
      time: "23:00",
      message:
        "Halo, lagi apa? Menu hari ini apa ya apakah kamu sudah makan malem ini?",
      sender: "other",
    },
    {
      id: 9,
      name: "Saya",
      time: "23:01",
      message: "Lagi coba bikin chat app 🚀",
      sender: "me",
      status: "sent",
    },
    {
      id: 10,
      name: "Salima",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
      time: "23:00",
      message:
        "Halo, lagi apa? Menu hari ini apa ya apakah kamu sudah makan malem ini?",
      sender: "other",
    },
    {
      id: 11,
      name: "Salima",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
      time: "23:00",
      message:
        "Halo, lagi apa? Menu hari ini apa ya apakah kamu sudah makan malem ini?",
      sender: "other",
    },
    {
      id: 12,
      name: "Saya",
      time: "23:01",
      message: "Kamu sedang melukis ya 🥰 🚀",
      sender: "me",
      status: "read",
    },
    {
      id: 13,
      name: "Ratna sinta 🦋",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
      time: "23:00",
      message:
        "Halo, lagi apa? Menu hari ini apa ya apakah kamu sudah makan malem ini?",
      sender: "other",
    },
    {
      id: 14,
      name: "Saya",
      time: "23:01",
      message: "Kamu sedang melukis ya 🥰 🚀",
      sender: "me",
      status: "delivered",
    },
  ]);

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
      />
    </div>
  );
}
