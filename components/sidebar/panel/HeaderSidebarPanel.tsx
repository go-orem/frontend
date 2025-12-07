import { IconNewChat, IconSet } from "@/components/icons";
import { useModal } from "../../../context/ModalContext";
import React from "react";

interface HeaderSidebarPanelProps {
  activeTab: "chats" | "channel" | "notification" | "group" | "settings" | "story" | "calls";
  onCreateGroupClick?: () => void;
}

function HeaderSidebarPanel({ activeTab, onCreateGroupClick }: HeaderSidebarPanelProps) {
  const { openModal } = useModal();

  // mapping judul berdasarkan tab
  const titles: Record<HeaderSidebarPanelProps["activeTab"], string> = {
    chats: "Chats",
    channel: "Channel",
    notification: "Notification",
    group: "Group",
    settings: "Settings",
    story: "Story",
    calls: "Calls",
  };

  const onNewChatClick = () => {
    if (onCreateGroupClick) return onCreateGroupClick();
    return null;
  };

  return (
    <>
      <div className="header-atas flex justify-between pb-3 items-center pl-6 pr-6">
        <div className="flex items-center space-x-2">
          {/* Judul berubah sesuai tab */}
          <div className="logo font-black  text-xl">
            <h1>{titles[activeTab]}</h1>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onNewChatClick}
            aria-label="Create group"
            className="cursor-pointer hover:bg-(--hovercolor) p-2 rounded-full"
          >
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

      {/* CreateGroup is rendered as a sidebar sub-tab by the parent panel */}
    </>
  );
}

export default HeaderSidebarPanel;
