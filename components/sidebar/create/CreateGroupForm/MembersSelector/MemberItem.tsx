"use client";

import { motion } from "framer-motion";
import { Check, ChevronDown, PlusIcon } from "lucide-react";

interface MemberItemProps {
  username: string;
  name: string;
  avatar_url?: string | null;
  isSelected: boolean;
  onToggle: () => void;
}

export function MemberItem({
  username,
  name,
  avatar_url,
  isSelected,
  onToggle,
}: MemberItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative group cursor-pointer p-3 mb-2 mt-3 rounded-xl 
        bg-white/5 border border-white/10 hover:border-[#30d5ff]/40 
        flex items-center gap-4 transition backdrop-blur-xl"
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-4 flex-1" onClick={onToggle}>
        {/* Avatar */}
        <div className="relative w-10 h-10 shrink-0">
          <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#30d5ff] transition">
            <img
              src={
                avatar_url ||
                `https://api.dicebear.com/7.x/thumbs/svg?seed=${name}`
              }
              className="w-full h-full object-cover"
            />
          </div>

          {/* Online dot */}
          {/* <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-black/60" /> */}
        </div>

        {/* Username */}
        <div className="flex-1">
          <div className="font-semibold text-sm capitalize">{name}</div>
          <div className="text-xs text-gray-400">@{username}</div>
        </div>
      </div>

      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 
          border border-white/10 group-hover:bg-white/10 transition"
      >
        {isSelected ? (
          <Check size={18} className="text-[#30d5ff]" />
        ) : (
          <PlusIcon size={16} className="text-gray-400" />
        )}
      </div>
    </motion.div>
  );
}
