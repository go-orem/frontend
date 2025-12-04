"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeaderChat from "../HeaderSidebarPanel";
import CreateGroup from "../../create/CreateGroup";
import ListGroup from "./GroupSidebarList";
import CategoryGroup from "./GroupSidebarCategory";
import { MobileMenu, Search } from "@/components/UI";
import { CreateGroupForm, CreateGroupFormContainer } from "../../create";

type GroupFilter = "all" | "private" | "public" | "paid";

export default function GroupSidebarPanel({
  onMenuClick,
  activeIndex,
}: {
  onMenuClick?: (index: number) => void;
  activeIndex?: number;
} = {}) {
  const [subTab, setSubTab] = useState<"list" | "create">("list");
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("all");
  const [sidebarWidth, setSidebarWidth] = useState<number>(430);
  const [previewWidth, setPreviewWidth] = useState<number>(430);
  const [loaded, setLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, previewWidth]);

  // saat masih load pertama kali, langsung render width terakhir tanpa animasi
  return (
    <div className={`w-full flex h-screen ${isDragging ? "select-none" : ""}`}>
      <motion.div
        className="max-w-full flex flex-col pt-3 pb-0 border-r border-gray-700 bg-[--sidebar-bg] overflow-scroll"
        initial={false} // biar gak animasi saat mount
        animate={{ width: isDragging ? previewWidth : sidebarWidth }}
        transition={
          loaded
            ? { type: "spring", stiffness: 300, damping: 35 } // animasi hanya setelah loaded
            : { duration: 0 } // saat mount langsung set tanpa animasi
        }
      >
        <HeaderChat
          activeTab="group"
          onCreateGroupClick={() => setSubTab("create")}
        />

        {subTab === "list" && (
          <>
            <Search />
            <CategoryGroup />
            <ListGroup />
          </>
        )}

        {subTab === "create" && (
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="mb-3 px-6 py-3">
                <button
                  onClick={() => setSubTab("list")}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to Groups
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <CreateGroupFormContainer>
                  <CreateGroupForm onClose={() => setSubTab("list")} />
                </CreateGroupFormContainer>
              </div>
            </div>
          </div>
        )}

        <MobileMenu onMenuClick={onMenuClick} activeIndex={activeIndex} />
      </motion.div>

      {/* garis drag */}
      <div
        onMouseDown={handleMouseDown}
        className={`cursor-col-resize w-[0.5px] 
          ${isDragging ? "bg-[--primarycolor]" : "bg-gray-700"}`}
        style={{ minHeight: "100%" }}
      />

      <div className="flex-1 bg-[--content-bg]" />
    </div>
  );
}
