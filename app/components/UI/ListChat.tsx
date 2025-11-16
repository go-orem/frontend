import React from "react";
import HoverGif from "./effects/HoverEffects";

interface ChatItem {
  id: number;
  name: string;
  message: string;
  time: string;
  img: string;
  borderColor: string;
}

const chats: ChatItem[] = [
  {
    id: 1,
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjk5Z2ZyYnp0N2UzbWdtaWp4dmpjcXRxb3VyNzlkMW50NjQ0ZHduZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/z7wIVXPnpm1DiJDdsU/giphy.gif",
    borderColor: "border-green-500",
  },
  {
    id: 2,
    name: "Bailu",
    message: "✔️ iya kamu sedang apa...",
    time: "Kemarin",
    img: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMG9xYmxnYW8zOW9wYzF2enRhOGZzMHhocDUycjhxNnE3bTNyN3pwcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/q217GUnfKAmJlFcjBX/giphy.gif",
    borderColor: "border-green-500",
  },
  {
    id: 3,
    name: "Bailu 😂🐝",
    message: "✔️ iya kamu sedang apa...",
    time: "14:00",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 4,
    name: "Sintia 🐝",
    message: "Iya sekarang di kantor ada...",
    time: "12:23",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 5,
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 6,
    name: "Bailu",
    message: "✔️ iya kamu sedang apa...",
    time: "Kemarin",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 7,
    name: "Bailu 😂🐝",
    message: "✔️ iya kamu sedang apa...",
    time: "14:00",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 8,
    name: "Sintia 🐝",
    message: "Iya sekarang di kantor ada...",
    time: "12:23",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 9,
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 10,
    name: "Bailu",
    message: "✔️ iya kamu sedang apa...",
    time: "Kemarin",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 11,
    name: "Bailu 😂🐝",
    message: "✔️ iya kamu sedang apa...",
    time: "14:00",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 12,
    name: "Sintia 🐝",
    message: "Iya sekarang di kantor ada...",
    time: "12:23",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 13,
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 14,
    name: "Bailu",
    message: "✔️ iya kamu sedang apa...",
    time: "Kemarin",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 15,
    name: "Bailu 😂🐝",
    message: "✔️ iya kamu sedang apa...",
    time: "14:00",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 16,
    name: "Sintia 🐝",
    message: "Iya sekarang di kantor ada...",
    time: "12:23",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 17,
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 18,
    name: "Bailu",
    message: "✔️ iya kamu sedang apa...",
    time: "Kemarin",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 19,
    name: "Bailu 😂🐝",
    message: "✔️ iya kamu sedang apa...",
    time: "14:00",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 20,
    name: "Sintia 🐝",
    message: "Iya sekarang di kantor ada...",
    time: "12:23",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 21,
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 22,
    name: "Bailu",
    message: "✔️ iya kamu sedang apa...",
    time: "Kemarin",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 23,
    name: "Bailu 😂🐝",
    message: "✔️ iya kamu sedang apa...",
    time: "14:00",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 24,
    name: "Sintia 🐝",
    message: "Iya sekarang di kantor ada...",
    time: "12:23",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 25,
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 26,
    name: "Bailu",
    message: "✔️ iya kamu sedang apa...",
    time: "Kemarin",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 27,
    name: "Bailu 😂🐝",
    message: "✔️ iya kamu sedang apa...",
    time: "14:00",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 28,
    name: "Sintia 🐝",
    message: "Iya sekarang di kantor ada...",
    time: "12:23",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 29,
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 30,
    name: "Bailu",
    message: "✔️ iya kamu sedang apa...",
    time: "Kemarin",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 31,
    name: "Bailu 😂🐝",
    message: "✔️ iya kamu sedang apa...",
    time: "14:00",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 32,
    name: "Sintia 🐝",
    message: "Iya sekarang di kantor ada...",
    time: "12:23",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 33,
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 34,
    name: "Bailu",
    message: "✔️ iya kamu sedang apa...",
    time: "Kemarin",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 35,
    name: "Bailu 😂🐝",
    message: "✔️ iya kamu sedang apa...",
    time: "14:00",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 36,
    name: "Sintia 🐝",
    message: "Iya sekarang di kantor ada...",
    time: "12:23",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 37,
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 38,
    name: "Bailu",
    message: "✔️ iya kamu sedang apa...",
    time: "Kemarin",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
  {
    id: 39,
    name: "Bailu 😂🐝",
    message: "✔️ iya kamu sedang apa...",
    time: "14:00",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 40,
    name: "Sintia 🐝",
    message: "Iya sekarang di kantor ada...",
    time: "12:23",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
];

function ChatCard({ name, message, time, img, borderColor }: ChatItem) {
  return (
    <HoverGif gifUrl="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d3oxMHJqNGRteHNnYm9seXdmeGhmZjF1ODU1cTFnNWFrMGdoN3NjZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13sI05qVwRXrVe/giphy.gif">
      <div className="flex p-3 justify-between rounded-xl cursor-pointer transition-colors duration-300 ease-in-out">
        <div className="flex space-x-3 items-center">
          <div className="profile w-12">
            <img
              className={`w-auto aspect-square rounded-full object-cover border-3 ${borderColor}`}
              src={img}
              alt={name}
            />
          </div>
          <div>
            <div className="name font-mono font-semibold">{name}</div>
            <p className="font-mono text-sm text-gray-400">{message}</p>
          </div>
        </div>
        <div>
          <span className="font-light items-start text-xs font-mono text-gray-400">
            {time}
          </span>
        </div>
      </div>
    </HoverGif>
  );
}

export default function ListChat() {
  return (
    <>
      <div className="container h-screen overflow-y-auto pl-3 pr-3">
        {chats.map((chat) => (
          <ChatCard key={chat.id} {...chat} />
        ))}
      </div>
    </>
  );
}
