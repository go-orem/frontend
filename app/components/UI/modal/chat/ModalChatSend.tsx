"use client";
import React, { useEffect } from "react";
import IconFoto from "@/app/components/icons/IconFoto";

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
  if (!open) return null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const mediaItems = [
    { label: "Foto", icon: <IconFoto /> },
    { label: "Video", icon: <IconFoto /> },
    { label: "Kamera", icon: <IconFoto /> },
    { label: "Dokumen", icon: <IconFoto /> },
    { label: "Lokasi", icon: <IconFoto /> },
    { label: "Kontak", icon: <IconFoto /> },
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
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-sm font-black font-mono text-white">Kirim Media</h3>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-300 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* GRID */}
      <div className="p-4 max-h-[45vh] overflow-auto text-gray-200">
        <div className="grid grid-cols-5 gap-4">
          {mediaItems.map((item, idx) => (
            <button
              key={idx}
              className="flex flex-col items-center gap-2 p-3 rounded-lg 
              bg-white/5 hover:bg-white/10 transition"
              onClick={() => console.log("Kirim:", item.label)}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center 
              bg-white/10 hover:bg-white/20 transition"
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
