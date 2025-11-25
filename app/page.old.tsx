"use client";
import { useEffect, useState } from "react";
import SplitView from "./components/layout/view/Page";
import { useAuth } from "@/hooks/useAuth";
import {
  ChannelSidebarPanel,
  ChatSidebarPanel,
  GroupSidebarPanel,
  NotificationSidebarPanel,
  SettingSidebarPanel,
  Sidebar,
} from "@/components/layout/sidebar";

function ChatContent() {
  return <ChatSidebarPanel />;
}
function NotifContent() {
  return <NotificationSidebarPanel />;
}
function ChannelContent() {
  return <ChannelSidebarPanel />;
}
function SettingsContent() {
  return <SettingSidebarPanel />;
}
function SettingGroup() {
  return <GroupSidebarPanel />;
}
// dst...

export default function Layout() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isLoggedIn } = useAuth();

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <ChatContent />;
      case 1:
        return <NotifContent />;
      case 2:
        return <ChannelContent />;
      case 3:
        return <SettingGroup />;
      case 10:
        return <SettingsContent />;
      default:
        return <div className="p-4 text-white">Pilih menu</div>;
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setActiveIndex(3);
    }
  }, [isLoggedIn]);

  return (
    <div className="flex">
      <Sidebar onMenuClick={(idx) => setActiveIndex(idx)} />
      <div className="flex-1 bg-[--background]">{renderContent()}</div>

      <SplitView />
    </div>
  );
}
