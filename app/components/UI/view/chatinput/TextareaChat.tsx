"use client";
import React, { useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
};

export default function TextareaChat({ value, onChange, onEnter }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [height, setHeight] = useState(42); // untuk deteksi tinggi

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter();

      // RESET height textarea setelah kirim pesan
      if (textareaRef.current) {
        textareaRef.current.style.height = "42px";
        setHeight(42);
      }
    }
  };

  // auto resize + update height
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;

    setHeight(el.scrollHeight);
  };

  // LOGIC rounded otomatis
  const dynamicRounded =
    height < 52
      ? "rounded-full"
      : height < 90
      ? "rounded-2xl"
      : "rounded-xl";

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={handleInput}
      onKeyDown={handleKey}
      placeholder="Tulis pesan..."
      className={`
        w-full px-4 py-2.5 text-sm
        bg-gray-800 text-white
        outline-none font-mono
        resize-none leading-[1.45]
        min-h-[42px] max-h-[150px] overflow-y-auto
        placeholder:text-gray-500
        border border-gray-700/40
        shadow-inner
        transition-all duration-150
        ${dynamicRounded}
      `}
      rows={1}
    />
  );
}
