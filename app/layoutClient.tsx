"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  ChannelSidebarPanel,
  ChatSidebarPanel,
  GroupSidebarPanel,
  NotificationSidebarPanel,
  SettingSidebarPanel,
  Sidebar,
} from "@/components/layout/sidebar";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const { isLoggedIn, loading: loadingAuth } = useAuth();
  const router = useRouter();
  const [sidebarPanelWidth, setSidebarPanelWidth] = useState<number>(400);

  const [isActiveContent, setIsActiveContent] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn && !loadingAuth) {
      setActiveIndex(3);
    }
    setIsActiveContent(false);
  }, [isLoggedIn, loadingAuth]);

  useEffect(() => {
    console.log("isActiveContent", isActiveContent);
  }, [isActiveContent]);
  useEffect(() => {
    console.log("sidebarPanelWidth", sidebarPanelWidth);
  }, [sidebarPanelWidth]);

  useEffect(() => {
    window.addEventListener("sidebar-panel-width-updated", () => {
      const storageSidebarPanelWidth = Number(
        localStorage.getItem("sidebarWidth")
      );
      console.log("SidebarWith berubah!", storageSidebarPanelWidth);

      if (storageSidebarPanelWidth >= 200 && storageSidebarPanelWidth <= 400) {
        setSidebarPanelWidth(storageSidebarPanelWidth);
      }
    });
  }, []);

  const onChatSelect = (val: any) => {
    console.log("selected", val);
    setIsActiveContent(true);
    router.push("/chat");
  };

  const onSidebarClick = (idx: number) => {
    if (activeIndex == idx) {
      setIsActiveContent(!isActiveContent);
    } else setIsActiveContent(false);
    setActiveIndex(idx);
  };

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <ChatSidebarPanel onListClick={onChatSelect} />;
      case 1:
        return <NotificationSidebarPanel />;
      case 2:
        return <ChannelSidebarPanel />;
      case 3:
        return <GroupSidebarPanel />;
      case 10:
        return <SettingSidebarPanel />;
      default:
        return <></>;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar onMenuClick={onSidebarClick} />

      {/* Content Panel */}
      <div
        className={`
      bg-[--background] transition-all duration-300  lg:max-w-[${sidebarPanelWidth}px]
      ${isActiveContent ? `max-w-0` : `max-w-full`}
    `}
      >
        <div className="h-full max-w-full  overflow-y-auto">
          {renderContent()}
        </div>
      </div>

      {/* Detail */}
      <div
        className={`
      flex-1 transition-all duration-300 min-w-[350px]
      ${
        isActiveContent
          ? `block w-full md:w-[calc(100%-400px)]`
          : "w-0 md:w-full"
      }
    `}
      >
        {children}
      </div>
    </div>
  );
}
