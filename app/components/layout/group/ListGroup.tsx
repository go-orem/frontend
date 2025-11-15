import React from "react";
import HoverGif from "../../UI/effects/HoverEffects";

interface ChatItem {
  id: number;
  name_group: string;
  member: number;
  online_user: number;
  img: string;
}

const chats: ChatItem[] = [
  {
    id: 1,
    name_group: "Crypto Indonesia 🦋",
    member: 1200,
    online_user: 129,
    img: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjk5Z2ZyYnp0N2UzbWdtaWp4dmpjcXRxb3VyNzlkMW50NjQ0ZHduZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/z7wIVXPnpm1DiJDdsU/giphy.gif",
  },
  {
    id: 2,
    name_group: "Public",
    member: 1290,
    online_user: 79,
    img: "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MDZuZWdndHg3cGM5cG10OGg2NGx5d3lmbjhtMjh5eHQ2ZXNob2hnNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FRsG2UpLPivKnJ5Rhi/giphy.gif",
  },
];

function ChatCard({ name_group, member, online_user, img }: ChatItem) {
  return (
    <HoverGif gifUrl="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d3oxMHJqNGRteHNnYm9seXdmeGhmZjF1ODU1cTFnNWFrMGdoN3NjZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13sI05qVwRXrVe/giphy.gif">
      <div className="flex p-3 justify-between rounded-xl cursor-pointer transition-colors duration-300 ease-in-out">
        <div className="flex space-x-3 items-center">
          <div className="profile w-11">
            <img
              className={`w-auto aspect-square rounded-full object-cover`}
              src={img}
              alt={name_group}
            />
          </div>
          <div>
            <div className="name font-mono font-semibold">{name_group}</div>
            <p className="font-mono text-sm text-gray-400">{member}K subcribers</p>
          </div>
        </div>
        <div>
          <span className="flex flex-col gap-y-1 items-center font-light text-xs font-mono text-gray-300">
            <button className="p-2 bg-(--hovercolor) text-xs rounded-full cursor-pointer">
              Subcribe
            </button>
            <div className="flex font-mono text-xs text-gray-400 items-center gap-1.5">
              <p>{online_user} online</p>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>{" "}
            </div>
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
