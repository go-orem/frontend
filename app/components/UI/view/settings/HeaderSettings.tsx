import React from "react";
import { useModal } from "../../modal/ModalContext";
import IconSetting from "@/components/icons/IconSetting";

interface HeaderChatProps {
  activeTab: "chats" | "channel" | "notification" | "settings"; // tab aktif
}

function HeaderSettings({ activeTab }: HeaderChatProps) {
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
      <div className="header-atas flex justify-between pb-3 items-center pl-8 pr-8">
        <div className="flex items-center space-x-2">
          {/* Judul berubah sesuai tab */}
          <div className="logo font-black font-mono text-xl">
            <h1>{titles[activeTab]}</h1>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={(e) => openModal(1, e.currentTarget)}
            className="cursor-pointer hover:bg-(--hovercolor) p-2 rounded-full"
          >
            <IconSetting />
          </button>
        </div>
      </div>
    </>
  );
}

export default HeaderSettings;
