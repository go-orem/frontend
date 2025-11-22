"use client";
import React, { useEffect, useState } from "react";
import IconSendPhoto from "@/app/components/icons/IconMediaSendChat/IconSendPhoto";
import IconSendVideo from "@/app/components/icons/IconMediaSendChat/IconSendVideo";
import IconSendCamera from "@/app/components/icons/IconMediaSendChat/IconSendCamera";
import IconSendDocs from "@/app/components/icons/IconMediaSendChat/IconSendDocs";
import IconSendLocations from "@/app/components/icons/IconMediaSendChat/IconSendLocations";
import IconSendContact from "@/app/components/icons/IconMediaSendChat/IconSendContact";
import IconSendPoll from "@/app/components/icons/IconMediaSendChat/IconSendPoll";

type ModalChatSendProps = {
  open: boolean;
  onClose: () => void;
  width?: string;
};

export default function ModalChatSend({
  open,
  onClose,
  width = "100%",
}: ModalChatSendProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!isClient || !open) return null;

  const mediaItems = [
    { label: "Photo", icon: <IconSendPhoto /> },
    { label: "Video", icon: <IconSendVideo /> },
    { label: "Camera", icon: <IconSendCamera /> },
    { label: "Documents", icon: <IconSendDocs /> },
    { label: "Locations", icon: <IconSendLocations /> },
    { label: "Contact", icon: <IconSendContact /> },
    { label: "Poll", icon: <IconSendPoll /> },
    { label: "Send", icon: <IconSendVideo /> },
  ];

  return (
    <aside
      role="dialog"
      aria-modal="true"
      style={{ width }}
      className={`
        absolute left-0 bottom-0
        transition-all duration-300
        ${open ? "translate-y-0" : "translate-y-full"}
        bg-(--background)/70 backdrop-blur-lg
        border-t border-(--primarycolor)/30
        shadow-xl z-20
        rounded-t-2xl
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between pb-1 pt-1 pr-8 pl-8 border-b border-white/10">
        <h3 className="text-sm font-black font-mono text-white">Media</h3>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-300 hover:text-white cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* GRID */}
      <div className="pt-2 pb-2 max-h-[20vh] overflow-auto text-gray-200">
        <div className="grid grid-cols-8 gap-4">
          {mediaItems.map((item, idx) => (
            <button
              key={idx}
              className="flex flex-col items-center gap-2 p-1 rounded-lg transition cursor-pointer"
              onClick={() => console.log("Kirim:", item.label)}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center 
                hover:bg-(--hovercolor) transition"
              >
                {item.icon}
              </div>
              <span className="text-xs font-mono">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
