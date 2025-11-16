"use client";
import HistoryOrem from "@/app/components/icons/IconWallet/HistoryOrem";
import React from "react";

interface ModalSearchChatProps {
  onCancel: () => void;
}

const ModalSearchChat: React.FC<ModalSearchChatProps> = ({ onCancel }) => {
  return (
    <aside className="flex items-center w-full h-full relative gap-2">
        <div>
            <HistoryOrem/>
        </div>
      <div className="flex items-center w-full h-full relative">
        {/* Input search */}
        <input
          id="header-search"
          type="search"
          placeholder="Cari atau chat..."
          className="
          w-full
          rounded-full
          border
          border-gray-600
          bg-transparent
          pl-5
          pr-5
          py-2
          text-sm
          font-mono
          text-gray-300
          placeholder-gray-500
          focus:outline-none
          focus:ring-1
          focus:ring-(--primarycolor)
        "
          autoFocus
        />

        {/* Tombol batal */}
        <button
          className="absolute right-0 mr-2 text-gray-400 hover:text-white font-mono text-sm"
          onClick={onCancel}
        >
          <span className="font-bold text-lg pr-3 cursor-pointer">❎</span>
        </button>
      </div>
    </aside>
  );
};

export default ModalSearchChat;
