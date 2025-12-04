"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { IconSendCamera } from "@/components/icons";

interface AvatarUploaderProps {
  value: string | null;
  onChange: (file: File | null, preview: string | null) => void;

  /** Optional */
  size?: number;
  className?: string;
}

export function AvatarUploader({
  value,
  onChange,
  size = 80,
  className = "",
}: AvatarUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatar = (file: File | null) => {
    if (!file) {
      onChange(null, null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={className}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        onClick={() => fileRef.current?.click()}
        className="
          cursor-pointer rounded-full overflow-hidden
          border border-white/10 bg-black/40
          hover:border-[#30d5ff]/60
          transition flex items-center justify-center
        "
        style={{ width: size, height: size }}
      >
        {value ? (
          <Image
            src={value}
            alt="Avatar"
            width={size}
            height={size}
            className="w-full h-full object-cover"
          />
        ) : (
          <IconSendCamera />
        )}
      </motion.div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleAvatar(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
