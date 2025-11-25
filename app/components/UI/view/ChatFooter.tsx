"use client";

import React, { useState, useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import dynamic from "next/dynamic";
import EmojiPicker from "@emoji-mart/react";
import DynamicEmojiButton from "../Emoji/DynamicEmojiButton";
import { useModalChat } from "../modal/chat/ModalChatContext";
import TextareaChat from "./chatinput/TextareaChat";
import { IconMic } from "@/components/icons";

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
  const { openModalChat, setOpenModalChat } = useModalChat();
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
      <div className="bottom-0 left-0 w-full p-2 pb-1 pl-5.5 pr-5.5 bg-transparent flex items-center space-x-3">
        {/* Emoji Button */}
        <DynamicEmojiButton
          showEmoji={showEmoji}
          toggleEmoji={() => setShowEmoji((s) => !s)}
          emojiList={[
            "/animations/LMAO.lottie",
            "/animations/1.lottie",
            "/animations/2.lottie",
            "/animations/3.lottie",
            "/animations/4.lottie",
            "/animations/5.lottie",
          ]}
          intervalMs={2000}
          random={true}
          pauseWhileOpen={true}
          sizePx={26}
          transitionMs={350}
        />

        {/* Attachment Button */}
        <button
          onClick={() => setOpenModalChat((prev) => !prev)}
          className="text-xl cursor-pointer transition-transform duration-200 hover:scale-110"
        >
          🔗
        </button>

        {/* Textarea */}
        <TextareaChat value={input} onChange={setInput} onEnter={sendMessage} />

        {/* Send Button */}
        <button
          onClick={sendMessage}
          className="p-2.5 items-center align-middle rounded-full bg-(--hovercolor) cursor-pointer transition-transform duration-200 hover:scale-110"
        >
          <IconMic />
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
