import React from "react";
import HoverGif from "../../effects/HoverEffects";

interface ChatItem {
  id: number;
  name: string;
  img: string;
  borderColor: string;
}

const chats: ChatItem[] = [
  {
    id: 1,
    name: "Selfi Agnes 🦋",
   
    img: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjk5Z2ZyYnp0N2UzbWdtaWp4dmpjcXRxb3VyNzlkMW50NjQ0ZHduZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/z7wIVXPnpm1DiJDdsU/giphy.gif",
    borderColor: "border-green-500",
  },
  {
    id: 2,
    name: "Bailu",
    
    img: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMG9xYmxnYW8zOW9wYzF2enRhOGZzMHhocDUycjhxNnE3bTNyN3pwcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/q217GUnfKAmJlFcjBX/giphy.gif",
    borderColor: "border-green-500",
  },
  {
    id: 3,
    name: "Bailu 😂🐝",
    
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 4,
    name: "Sintia 🐝",
    
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-amber-300",
  },
  {
    id: 5,
    name: "Selfi Agnes 🦋",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    borderColor: "border-green-500",
  },
];

function NotifikasiView({ name, img, borderColor }: ChatItem) {
  return (
    <HoverGif gifUrl="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d3oxMHJqNGRteHNnYm9seXdmeGhmZjF1ODU1cTFnNWFrMGdoN3NjZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13sI05qVwRXrVe/giphy.gif">
      <div className="flex p-3 items-center justify-between rounded-xl cursor-pointer transition-colors duration-300 ease-in-out">
        <div className="flex space-x-3 items-center">
          <div className="profile w-11">
            <img
              className={`w-auto aspect-square rounded-full object-cover border-3 ${borderColor}`}
              src={img}
              alt={name}
            />
          </div>
          <div>
            <div className="name font-mono font-semibold">{name}</div>
          </div>
        </div>
        <div>
          <div className="flex gap-3 font-mono text-xs">
            <button className="p-2 bg-(--hovercolor) rounded-full cursor-pointer">
              Terima
            </button>
            <button className="p-2 bg-(--hovercolor) rounded-full cursor-pointer">
              Tolak
            </button>
          </div>
        </div>
      </div>
    </HoverGif>
  );
}

export default function ViewNotifikasi() {
  return (
    <>
      <div className="container h-screen overflow-y-auto pl-3 pr-3">
        {chats.map((chat) => (
          <NotifikasiView key={chat.id} {...chat} />
        ))}
      </div>
    </>
  );
}
