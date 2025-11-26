import { HoverGif } from "../effects";

interface ChatItem {
  id: string;
  name: string;
  message: string;
  time: string;
  img: string;
  borderColor: string;
  onChatClick?: () => void;
}

const chats: ChatItem[] = [
  {
    id: "asdasd",
    name: "Selfi Agnes 🦋",
    message: "📞 Hallo Selamat Siang...",
    time: "Hari ini",
    img: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjk5Z2ZyYnp0N2UzbWdtaWp4dmpjcXRxb3VyNzlkMW50NjQ0ZHduZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/z7wIVXPnpm1DiJDdsU/giphy.gif",
    borderColor: "border-green-500",
  },
];

function ChatCard({
  id,
  name,
  message,
  time,
  img,
  borderColor,
  onChatClick,
}: ChatItem) {
  return (
    <HoverGif
      gifUrl="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3d3oxMHJqNGRteHNnYm9seXdmeGhmZjF1ODU1cTFnNWFrMGdoN3NjZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13sI05qVwRXrVe/giphy.gif"
      onClick={() => onChatClick && onChatClick()}
    >
      <div className="flex p-3 justify-between rounded-xl cursor-pointer transition-colors duration-300 ease-in-out min-w-[300px]">
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

export default function ListChat({
  onListClick,
}: {
  onListClick?: (chat: any) => void;
}) {
  return (
    <>
      <div className="container h-screen overflow-y-auto pl-3 pr-3">
        {chats.map((chat) => (
          <ChatCard
            key={chat.id}
            {...chat}
            onChatClick={() => onListClick && onListClick(chat)}
          />
        ))}
      </div>
    </>
  );
}
