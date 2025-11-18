import React, { useEffect, useRef, useState } from "react";

type Props = {
  textareaRef?: React.Ref<HTMLTextAreaElement>;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  height: number;
  onSend?: () => void; // callback saat enter
};

export default function TextareaCore({
  textareaRef,
  value,
  onChange,
  onKeyDown,
  onPaste,
  height,
  onSend,
}: Props) {
  const localRef = useRef<HTMLTextAreaElement | null>(null);
  const taRef = textareaRef || localRef;

  const DEFAULT_HEIGHT = 42; // default kecil untuk rounded-full
  const [localHeight, setLocalHeight] = useState(DEFAULT_HEIGHT);

  // sync height prop, tapi hanya kalau ada value
  useEffect(() => {
    if (value) {
      setLocalHeight(height);
    } else {
      setLocalHeight(DEFAULT_HEIGHT);
    }
  }, [height, value]);

  // rounded class berdasarkan height
  const getRoundedClass = () => {
    if (localHeight <= 52) return "rounded-full";
    if (localHeight < 120) return "rounded-2xl";
    return "rounded-xl";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown(e);
    if (e.key === "Enter" && !e.shiftKey) {
      onSend?.();

      // reset height hanya kalau value kosong
      if (!value.trim()) {
        setLocalHeight(DEFAULT_HEIGHT);
      }
    }
  };

  return (
    <textarea
      ref={taRef}
      value={value}
      placeholder="Tulis pesan..."
      aria-label="Chat input"
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onPaste={onPaste}
      className={`
          w-full px-4 py-2.5 text-sm font-mono
          bg-gray-800 text-white outline-none resize-none
          leading-[1.45] min-h-[42px] max-h-[300px] overflow-y-auto
          border border-gray-700/40 shadow-inner transition-all duration-150
          ${getRoundedClass()}
        `}
      style={{ height: localHeight }}
    />
    
  );
}
