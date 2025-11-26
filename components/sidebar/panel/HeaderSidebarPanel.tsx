import { IconNewChat, IconSet } from "@/components/icons";
import { useModal } from "../../../context/ModalContext";

interface HeaderSidebarPanelProps {
  activeTab: "chats" | "channel" | "notification" | "group" | "settings";
}

function HeaderSidebarPanel({ activeTab }: HeaderSidebarPanelProps) {
  const { openModal } = useModal();

  // mapping judul berdasarkan tab
  const titles: Record<HeaderSidebarPanelProps["activeTab"], string> = {
    chats: "Chats",
    channel: "Channel",
    notification: "Notification",
    group: "Group",
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

export default HeaderSidebarPanel;
