"use client";
import React, { ReactNode, useState } from "react";

interface HoverGifProps {
  gifUrl: string;
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function HoverGif({
  gifUrl,
  children,
  active = false,
  onClick,
  className = "",
}: HoverGifProps) {
  const [hovered, setHovered] = useState(false);
  const showEffect = hovered || active;

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* GIF Background */}
      <img
        src={gifUrl}
        alt="hover animation"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-400 ease-in-out ${
          showEffect ? "opacity-25" : "opacity-0"
        }`}
      />

      {/* Gradient overlay kanan -> kiri */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-500 ease-in-out ${
          showEffect ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Konten */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
