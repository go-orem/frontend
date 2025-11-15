import React from "react";
import HoverGif from "../../UI/effects/HoverEffects";

interface ChatItem {
  id: number;
  name_group: string;
  member: number;
  time: string;
  img: string;
  borderColor: string;
}

const chats: ChatItem[] = [
  {
    id: 1,
    name_group: "Crypto Indonesia 🦋",
    member: 1200,
    time: "Hari ini",
    img: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjk5Z2ZyYnp0N2UzbWdtaWp4dmpjcXRxb3VyNzlkMW50NjQ0ZHduZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/z7wIVXPnpm1DiJDdsU/giphy.gif",
    borderColor: "border-green-500",
  },
  {
    id: 2,
    name_group: "Public",
    member: 1290,
    time: "Hari ini",
    img: "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MDZuZWdndHg3cGM5cG10OGg2NGx5d3lmbjhtMjh5eHQ2ZXNob2hnNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FRsG2UpLPivKnJ5Rhi/giphy.gif",
    borderColor: "border-[--primarycolor]",
  },
];

function ChatCard({ name_group, member, time, img, borderColor }: ChatItem) {
  return (
    <HoverGif gifUrl="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d3oxMHJqNGRteHNnYm9seXdmeGhmZjF1ODU1cTFnNWFrMGdoN3NjZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13sI05qVwRXrVe/giphy.gif">
      <div className="flex p-3 justify-between rounded-xl cursor-pointer transition-colors duration-300 ease-in-out">
        <div className="flex space-x-3 items-center">
          <div className="profile w-11">
            <img
              className={`w-auto aspect-square rounded-full object-cover border-3 ${borderColor}`}
              src={img}
              alt={name_group}
            />
          </div>
          <div>
            <div className="name font-mono font-semibold">{name_group}</div>
            <p className="font-mono text-sm text-gray-400">{member}K member</p>
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

export default function ListGroup() {
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
