"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useModal } from "./ModalContext";
import {
  Send,
  CornerUpRight,
  AtSign,
  Flag,
  Smile,
  User,
  CheckCircle,
} from "lucide-react";
import IconReply from "../../icons/IconReply";
import IconForward from "../../icons/IconForward";
import IconWhisper from "../../icons/IconWhisper";
import IconProfile from "../../icons/IconProfile";
import IconSuka from "../../icons/IconSuka";
import EmojiPickerButton from "../Emoji/EmojiPickerButton";

export default function FloatingMenu() {
  const { modalData, closeModal } = useModal();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState<string>("");
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null
  );
  const [origin, setOrigin] = useState("top center");

  useEffect(() => {
    if (modalData?.anchor) {
      const rect = modalData.anchor.getBoundingClientRect();
      const menuHeight = 260;
      const viewportHeight = window.innerHeight;

      let top: number;
      let transformOrigin: string;

      if (rect.bottom + menuHeight + 16 < viewportHeight) {
        top = rect.bottom + 8;
        transformOrigin = "top center";
      } else {
        top = rect.top - menuHeight - 8;
        transformOrigin = "bottom center";
      }

      setMenuPos({
        top,
        left: rect.left + rect.width / 2 - 280 / 2,
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

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.9, y: origin.startsWith("top") ? -8 : 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: origin.startsWith("top") ? -8 : 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed w-[250px] bg-[#0F0F10]/25 backdrop-blur-xl rounded-2xl p-4 shadow-2xl space-y-4 z-9999 font-mono text-sm border border-white/15"
      style={{
        top: menuPos.top,
        left: menuPos.left,
        transformOrigin: origin,
      }}
    >
      {/* Emoji bar */}
      <div className="flex justify-center gap-3.5 text-xl cursor-pointer">
        <span>😁</span>
        <span>🥰</span>
        <span>🎯</span>
        <span>😏</span>
        <span>😌</span>
        <EmojiPickerButton
          onSelect={(emoji) => setInput((prev: string) => prev + emoji)}
          trigger={<button className="text-xl cursor-pointer">+</button>}
        />
      </div>

      {/* Grup 1 */}
      <div>
        <MenuItem icon={<IconReply />} label="Reply" />
        <MenuItem icon={<IconForward />} label="Forward" />
        <MenuItem icon={<AtSign size={18} />} label="@Mention" />
        <MenuItem icon={<IconWhisper />} label="Whisper" />
      </div>

      {/* Grup 2 */}
      <div>
        <MenuItem icon={<IconSuka />} label="Sukai Pesan" />
        <MenuItem icon={<IconProfile />} label="Profile" />
        <MenuItem icon={<Flag size={18} />} label="Hapus chat" />
        <MenuItem icon={<Flag size={18} />} label="Report" />
      </div>
    </motion.div>
  );
}

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm rounded-md cursor-pointer hover:bg-(--hovercolor)">
      <span className="text-gray-300">{icon}</span>
      <span className="text-gray-200">{label}</span>
    </button>
  );
}
