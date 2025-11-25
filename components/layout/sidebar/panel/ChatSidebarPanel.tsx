"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Search from "../../../../app/components/UI/Search";
import ListChat from "../../../../app/components/UI/ListChat";
import HeaderChat from "../../../../app/components/UI/HeaderChat";
import SliderIcon from "../../../../app/components/UI/SliderIcon";
import MobileMenu from "../../../../app/components/UI/MobileMenu";
import { useAuth } from "@/hooks/useAuth";
import {
  SidebarPanelGuest,
  SidebarPanelLoading,
} from "@/components/UI/sidebar-panel";

export default function ChatSidebarPanel({
  onListClick,
}: {
  onListClick?: (chat: any) => void;
}) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(430);
  const [previewWidth, setPreviewWidth] = useState<number>(430);
  const [loaded, setLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { isLoggedIn, loading: loadingAuth } = useAuth();

  // baca dari localStorage sekali, tanpa flicker
  useEffect(() => {
    const saved = localStorage.getItem("sidebarWidth");
    const width = saved ? parseInt(saved) : 430;
    setSidebarWidth(width);
    setPreviewWidth(width);
    setLoaded(true);
  }, []);

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newWidth = e.clientX;
    if (newWidth > 200 && newWidth < 600) {
      setPreviewWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setSidebarWidth(previewWidth);
    localStorage.setItem("sidebarWidth", previewWidth.toString());
  };

  useEffect(() => {
    window.dispatchEvent(new Event("sidebar-panel-width-updated"));
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, previewWidth]);

  // saat masih load pertama kali, langsung render width terakhir tanpa animasi
  return (
    <div className={`flex h-screen ${isDragging ? "select-none" : ""}`}>
      <motion.div
        className="flex flex-col pt-3 pb-0 border-r overflow-scroll border-gray-700 bg-[--sidebar-bg]"
        initial={false} // biar gak animasi saat mount
        animate={{ width: isDragging ? previewWidth : sidebarWidth }}
        transition={
          loaded
            ? { type: "spring", stiffness: 300, damping: 35 } // animasi hanya setelah loaded
            : { duration: 0 } // saat mount langsung set tanpa animasi
        }
      >
        <HeaderChat activeTab="chats" />
        {loadingAuth && <SidebarPanelLoading />}
        {!isLoggedIn && <SidebarPanelGuest />}
        {isLoggedIn && !loadingAuth && (
          <>
            <Search />
            <SliderIcon />
            <ListChat onListClick={onListClick} />
            <MobileMenu />
          </>
        )}
      </motion.div>

      {/* garis drag */}
      <div
        onMouseDown={handleMouseDown}
        className={`cursor-col-resize w-[0.5px] relative z-10
          ${isDragging ? "bg-[--primarycolor]" : "bg-gray-700"}`}
        style={{ minHeight: "100%" }}
      />

      <div className="flex-1 bg-[--content-bg]" />
    </div>
  );
}
