"use client";
import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import SplitView from "./components/layout/view/Page";
import ChatSidebar from "./components/layout/chat/Page";
import ChannelPage from "./components/layout/channel/ChannelPage";
import NotifikasiPage from "./components/layout/notifikasi/NotifikasiPage";
import SettingsPage from "./components/layout/settings/SettingsPage";

function ChatContent() {
  return <ChatSidebar />;
}
function NotifContent() {
  return <NotifikasiPage />;
}
function ChannelContent() {
  return <ChannelPage />;
}
function SettingsContent() {
  return <SettingsPage />;
}
// dst...

export default function Layout() {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <ChatContent />;
      case 1:
        return <NotifContent />;
      case 2:
        return <ChannelContent />;
      case 10:
        return <SettingsContent />;
      default:
        return <div className="p-4 text-white">Pilih menu</div>;
    }
  };

  return (
    <div className="flex">
      <Sidebar onMenuClick={(idx) => setActiveIndex(idx)} />
      <div className="flex-1 bg-[--background]">{renderContent()}</div>

      <SplitView />
    </div>
  );
}
