"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeaderSidebarPanel from "../HeaderSidebarPanel";
import { MobileMenu, Search } from "@/components/UI";
import { Plus, X } from "lucide-react";

import StoryList from "./StoryList";
import StoryCreate from "./StoryCreate";

type Props = {
  onMenuClick?: (index: number) => void;
  activeIndex?: number;
};

export default function StorySidebarPanel({
  onMenuClick,
  activeIndex,
}: Props = {}) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(430);
  const [previewWidth, setPreviewWidth] = useState<number>(430);
  const [loaded, setLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [creatorOpen, setCreatorOpen] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState<number | null>(null);

  const [uploaderOpen, setUploaderOpen] = useState<boolean>(false);

  // Load saved width
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
    if (newWidth > 260 && newWidth < 900) {
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

  return (
    <div className={`flex h-screen ${isDragging ? "select-none" : ""}`}>
      {/* SIDEBAR */}
      <motion.div
        className="max-w-full flex flex-col border-r border-gray-700 bg-[--sidebar-bg] overflow-hidden"
        initial={false}
        animate={{ width: isDragging ? previewWidth : sidebarWidth }}
        transition={
          loaded
            ? { type: "spring", stiffness: 300, damping: 35 }
            : { duration: 0 }
        }
      >
        <HeaderSidebarPanel activeTab="story" />

        {/* Search */}
        <div className="mt-3 mb-2">
          <Search />
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto custom-scroll px-5 py-3">
          <StoryList
            onStoryClick={(id) => {
              setEditingStoryId(id);
              setUploaderOpen(true);
            }}
            onEdit={(id) => {
              setEditingStoryId(id);
              setUploaderOpen(true);
            }}
          />
        </div>

        <MobileMenu onMenuClick={onMenuClick} activeIndex={activeIndex} />
      </motion.div>

      {/* DRAG HANDLE */}
      <div
        onMouseDown={handleMouseDown}
        className={`cursor-col-resize w-px ${
          isDragging ? "bg-[--primarycolor]" : "bg-gray-700"
        }`}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-[--content-bg] relative">
        {/* Floating Button */}
        <button
          onClick={() => {
            setEditingStoryId(null);
            setCreatorOpen(true);
          }}
          className="
            fixed right-6 bottom-6 z-40 flex items-center gap-2
            px-4 py-2 rounded-full shadow-2xl
            bg-linear-to-r from-violet-500 to-cyan-400 text-black
            hover:scale-105 transition-transform
          "
        >
          <Plus size={16} />
          <span className="text-sm font-medium">New Story</span>
        </button>

        {/* STORY CREATE / EDIT MODAL */}
        {creatorOpen && (
          <StoryCreate
            storyId={editingStoryId} // null = create, ada id = edit
            onClose={() => {
              setCreatorOpen(false);
              setUploaderOpen(false);
              setEditingStoryId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
