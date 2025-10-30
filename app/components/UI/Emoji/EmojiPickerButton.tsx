"use client";

import React, { useState, useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import dynamic from "next/dynamic";
import EmojiPicker from "@emoji-mart/react";

const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });

const custom = [
  {
    id: "gif",
    name: "Gif",
    emojis: [
      {
        id: "octocat",
        name: "Octocat",
        keywords: ["gif"],
        skins: [{ src: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmRyc3p3MWhrbmtiZ20xMWFid29rbDY2YzQ0cXVuY2JwZHQ0MThsZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/k6eKmuEEYYvG0qcG9d/giphy.gif" }],
      },
      {
        id: "octocat",
        name: "Octocat",
        keywords: ["gif"],
        skins: [{ src: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXc4NWJzbHFvZ3VkN3dyNTJ2YWs2eHVkaWtmbDVmODB1YWkxZ2d6NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/xZ6YzXZkSs64wk4s7C/giphy.gif" }],
      },
    ],
  },
];

interface EmojiPickerButtonProps {
  onSelect: (emoji: string) => void; // callback saat pilih emoji
  trigger?: React.ReactNode; // button custom
  theme?: "light" | "dark";
}

const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({
  onSelect,
  trigger,
  theme = "auto",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close picker if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  const handleSelect = (emoji: { native: string }) => {
    onSelect(emoji.native);
    setShowPicker(false); // auto close
  };

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {/* Trigger Button */}
      <div
        onClick={() => setShowPicker((prev) => !prev)}
        className="inline-block"
      >
        {trigger ? (
          trigger
        ) : (
          <button className="p-2 rounded-full bg-gray-700 text-black">+</button>
        )}
      </div>

      {/* Emoji Picker */}
      {showPicker && (
        <div
          className="absolute z-50 shadow-lg rounded-xl overflow-hidden"
          style={{
            top: 30,
            right: -34,
            maxWidth: "95vw",
          }}
        >
          <EmojiPicker
            data={data}
            custom={custom}
            theme={theme}
            perLine={10}
            emojiSize={23}
            navPosition="bottom"
            searchPosition="top"
            emojiButtonSize={38}
            previewPosition="none"
            skinTonePosition="none"
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
