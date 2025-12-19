"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AtSign, Flag } from "lucide-react";
import {
  IconForward,
  IconProfile,
  IconReply,
  IconSuka,
  IconWhisper,
} from "@/components/icons";
import { EmojiPickerButton } from "@/components/UI";
import { useModal } from "@/context";

export default function FloatingMenuChat() {
  const { modalData, closeModal } = useModal();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null
  );
  const [origin, setOrigin] = useState("top center");

  // ✅ Get messageId from modalData
  const messageId = modalData?.data;

  useEffect(() => {
    if (modalData?.anchor) {
      const rect = modalData.anchor.getBoundingClientRect();
      const menuHeight = 380;
      const menuWidth = 280;
      const padding = 16;
      const marginBuffer = 24; // ✅ Extra buffer untuk safe spacing

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let top: number;
      let left: number;
      let transformOrigin: string;

      // ✅ IMPROVED: Check space BELOW with buffer
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow >= menuHeight + marginBuffer) {
        // ✅ Plenty of space below
        top = rect.bottom + 8;
        transformOrigin = "top center";
      } else if (spaceAbove >= menuHeight + marginBuffer) {
        // ✅ Plenty of space above
        top = rect.top - menuHeight - 8;
        transformOrigin = "bottom center";
      } else {
        // ✅ IMPROVED: Smart fallback
        // If roughly equal space, prefer below
        if (spaceBelow >= spaceAbove) {
          top = rect.bottom + 8;
          transformOrigin = "top center";
        } else {
          top = rect.top - menuHeight - 8;
          transformOrigin = "bottom center";
        }
      }

      // ✅ Clamp top to viewport bounds
      top = Math.max(
        padding,
        Math.min(top, viewportHeight - menuHeight - padding)
      );

      // ✅ Horizontal positioning with overflow prevention
      let preferredLeft = rect.left + rect.width / 2 - menuWidth / 2;

      if (preferredLeft + menuWidth + padding > viewportWidth) {
        // ✅ Too far right, shift left
        left = viewportWidth - menuWidth - padding;
      } else if (preferredLeft < padding) {
        // ✅ Too far left, shift right
        left = padding;
      } else {
        left = preferredLeft;
      }

      setMenuPos({
        top,
        left,
      });
      setOrigin(transformOrigin);
    }
  }, [modalData]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeModal();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  if (!modalData || !menuPos) return null;

  const handleReply = () => {
    console.log("Reply to message:", messageId);
    closeModal();
  };

  const handleForward = () => {
    console.log("Forward message:", messageId);
    closeModal();
  };

  const handleMention = () => {
    console.log("Mention for message:", messageId);
    closeModal();
  };

  const handleWhisper = () => {
    console.log("Whisper message:", messageId);
    closeModal();
  };

  const handleLike = () => {
    console.log("Like message:", messageId);
    closeModal();
  };

  const handleDelete = () => {
    if (confirm("Delete this message?")) {
      console.log("Delete message:", messageId);
      closeModal();
    }
  };

  const handleReport = () => {
    console.log("Report message:", messageId);
    closeModal();
  };

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.9, y: origin.startsWith("top") ? -8 : 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: origin.startsWith("top") ? -8 : 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed w-[280px] bg-[#0F0F10]/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl space-y-1 z-9999 text-sm border border-white/15 max-h-[90vh] overflow-y-auto"
      style={{
        top: `${menuPos.top}px`,
        left: `${menuPos.left}px`,
        transformOrigin: origin,
      }}
    >
      {/* Emoji Quick Reactions */}
      <div className="flex justify-center gap-2 text-lg cursor-pointer py-2 border-b border-white/10 flex-wrap">
        <span className="hover:scale-110 transition">😁</span>
        <span className="hover:scale-110 transition">🥰</span>
        <span className="hover:scale-110 transition">🎯</span>
        <span className="hover:scale-110 transition">😏</span>
        <span className="hover:scale-110 transition">😌</span>
        <EmojiPickerButton
          onSelect={(emoji) => console.log("Selected emoji:", emoji)}
          trigger={
            <button className="text-lg cursor-pointer hover:scale-110 transition">
              +
            </button>
          }
        />
      </div>

      {/* Message Actions Group 1 */}
      <div>
        <MenuItem icon={<IconReply />} label="Reply" onClick={handleReply} />
        <MenuItem
          icon={<IconForward />}
          label="Forward"
          onClick={handleForward}
        />
        <MenuItem
          icon={<AtSign size={18} />}
          label="@Mention"
          onClick={handleMention}
        />
      </div>

      {/* Message Actions Group 2 */}
      <div className="border-t border-white/10 pt-1">
        <MenuItem
          icon={<IconSuka />}
          label="Like Message"
          onClick={handleLike}
        />
        <MenuItem
          icon={<IconProfile />}
          label="View Profile"
          onClick={() => {
            console.log("View sender profile");
            closeModal();
          }}
        />
        <MenuItem
          icon={<Flag size={18} />}
          label="Delete Message"
          onClick={handleDelete}
          danger
        />
        <MenuItem
          icon={<Flag size={18} />}
          label="Report Message"
          onClick={handleReport}
          danger
        />
      </div>
    </motion.div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, onClick, danger = false }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 text-left text-sm rounded-md cursor-pointer transition-colors ${
        danger
          ? "text-red-400 hover:bg-red-950/30"
          : "text-gray-200 hover:bg-white/10"
      }`}
    >
      <span className={danger ? "text-red-400" : "text-gray-300"}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
