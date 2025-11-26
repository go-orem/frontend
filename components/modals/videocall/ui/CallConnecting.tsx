"use client";
import React from "react";

export function CallConnecting({ onClose }: { onClose?: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-xl text-white font-mono">
      <div className="flex flex-col items-center gap-3">
        <div className="loader w-12 h-12 rounded-full border-4 border-white/30 animate-spin" />
        <div>Connecting…</div>
      </div>
    </div>
  );
}
