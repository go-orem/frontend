import React from "react";
import IconNewChat from "../icons/IconNewChat";
import IconSet from "../icons/IconSet";
import { useModal } from "./modal/ModalContext";

interface HeaderChatProps {
  activeTab: "chats" | "channel" | "notification" | "settings"; // tab aktif
}

function HeaderChat({ activeTab }: HeaderChatProps) {
  const { openModal } = useModal();

  // mapping judul berdasarkan tab
  const titles: Record<HeaderChatProps["activeTab"], string> = {
    chats: "Chats",
    channel: "Channel",
    notification: "Notification",
    settings: "Settings",
  };

  return (
    <>
      <div className="header-atas flex justify-between pb-3 items-center pl-6 pr-6">
        <div className="flex items-center space-x-2">
          {/* Judul berubah sesuai tab */}
          <div className="logo font-black font-mono text-xl">
            <h1>{titles[activeTab]}</h1>
          </div>
        </div>
        <div className="flex space-x-3">
          {/* tombol tambahan */}
          <button className="cursor-pointer hover:bg-(--hovercolor) p-2 rounded-full">
            <IconNewChat />
          </button>
          <button
            onClick={(e) => openModal(1, e.currentTarget)}
            className="cursor-pointer hover:bg-(--hovercolor) p-2 rounded-full"
          >
            <IconSet />
          </button>
        </div>
      </div>
    </>
  );
}

export default HeaderChat;
