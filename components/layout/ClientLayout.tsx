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
  StorySidebarPanel,
  CallsSidebarPanel,
  Sidebar,
} from "@/components/sidebar";
import { useBreakpoint, useIsMobile } from "@/hooks/useBreakpoint";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const { isLoggedIn, loading: loadingAuth } = useAuth();
  const isMobile = useIsMobile();
  const router = useRouter();
  const [sidebarPanelWidth, setSidebarPanelWidth] = useState<number>(400);

  const [toggleSidebar, setToggleSidear] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoggedIn && !loadingAuth) {
      setActiveIndex(3);
    }
    if (isMobile) setToggleSidear(false);
    else setToggleSidear(true);
  }, [isLoggedIn, loadingAuth]);

  useEffect(() => {
    window.addEventListener("sidebar-panel-width-updated", () => {
      const storageSidebarPanelWidth = Number(
        localStorage.getItem("sidebarWidth")
      );

      if (storageSidebarPanelWidth >= 200 && storageSidebarPanelWidth <= 400) {
        setSidebarPanelWidth(storageSidebarPanelWidth);
      }
    });
  }, []);

  const onChatSelect = (val: any) => {
    if (isMobile) setToggleSidear(false);
    router.push(`/channel/${val}`);
  };

  const onSidebarClick = (idx: number) => {
    if (activeIndex == idx) {
      setToggleSidear(!toggleSidebar);
    } else setToggleSidear(true);
    setActiveIndex(idx);
  };

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <ChatSidebarPanel onListClick={onChatSelect} onMenuClick={onSidebarClick} activeIndex={activeIndex} />;
      case 1:
        return <NotificationSidebarPanel onMenuClick={onSidebarClick} activeIndex={activeIndex} />;
      case 2:
        return <ChannelSidebarPanel onMenuClick={onSidebarClick} activeIndex={activeIndex} />;
      case 3:
        return <GroupSidebarPanel onMenuClick={onSidebarClick} activeIndex={activeIndex} />;
      case 4:
        return <StorySidebarPanel onMenuClick={onSidebarClick} activeIndex={activeIndex} />;
      case 5:
        return <CallsSidebarPanel onMenuClick={onSidebarClick} activeIndex={activeIndex} />;
      case 10:
        return <SettingSidebarPanel onMenuClick={onSidebarClick} activeIndex={activeIndex} />;
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
      ${toggleSidebar ? `max-w-[calc(100%-50px)]` : `max-w-0`}
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
        toggleSidebar ? "w-0 md:w-full" : `block w-full md:w-[calc(100%-400px)]`
      }
    `}
      >
        {children}
      </div>
    </div>
  );
}
