"use client";

import React, { useState, useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import dynamic from "next/dynamic";
import IconKirim from "../../icons/IconKirim";
import EmojiPicker from "@emoji-mart/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });

interface ChatFooterProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
}

const ChatFooter: React.FC<ChatFooterProps> = ({
  input,
  setInput,
  sendMessage,
}) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Detect system dark mode
  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    const setSystemTheme = (e: MediaQueryListEvent | MediaQueryList) =>
      setTheme(e.matches ? "dark" : "light");
    setSystemTheme(matchDark);
    matchDark.addEventListener("change", setSystemTheme);
    return () => matchDark.removeEventListener("change", setSystemTheme);
  }, []);

  // Close emoji panel if clicked outside wrapper
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true); // capture phase
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  const handleEmojiSelect = (emoji: {
    id: string;
    name: string;
    native: string;
  }) => {
    setInput((prev) => prev + emoji.native);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Footer Chat */}
      <div className="bottom-0 left-0 w-full p-2 pb-1 pl-5.5 pr-5.5 bg-transparent flex items-center space-x-4">
        {/* Emoji Button */}
        <button
          className={`text-xl cursor-pointer transition-transform duration-200 ${
            showEmoji ? "scale-125" : "scale-100"
          }`}
          onClick={() => setShowEmoji(!showEmoji)}
        >
          <div className="w-7 h-7">
            <DotLottieReact src="/animations/LMAO.lottie" loop autoplay />
          </div>
        </button>

        {/* Attachment Button */}
        <button className="text-xl cursor-pointer transition-transform duration-200 hover:scale-110">
          🔗
        </button>

        {/* Textarea */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Tulis pesan..."
          className="flex-1 px-4 py-2 text-sm rounded-xl bg-gray-800 text-white outline-none font-mono resize-none leading-relaxed max-h-32 overflow-y-auto"
          rows={1}
        />

        {/* Send Button */}
        <button
          onClick={sendMessage}
          className="p-2.5 items-center align-middle rounded-full bg-(--primarycolor) cursor-pointer transition-transform duration-200 hover:scale-110"
        >
          <IconKirim />
        </button>
      </div>

      {/* Floating Emoji Panel */}
      <div
        className={`absolute left-0 z-50 shadow-lg rounded-xl overflow-hidden transform transition-all duration-200 origin-bottom-left ${
          showEmoji
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          bottom: "100%",
          marginBottom: "8px",
          maxWidth: "90vw",
        }}
      >
        {showEmoji && (
          <EmojiPicker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme={theme}
            perLine={10}
            emojiSize={25}
            previewPosition="none"
            navPosition="bottom"
            showPreview={true}
            showSkinTones={true}
            searchPosition="top"
            lazyLoadEmojis={true}
            emojiButtonSize={38}
            skinTonePosition="none"
          />
        )}
      </div>
    </div>
  );
};

export default ChatFooter;
