import React from "react";

type Props = {
  textareaRef?: React.Ref<HTMLTextAreaElement> | any;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  height: number;
};

export default function TextareaCore({ textareaRef, value, onChange, onKeyDown, onPaste, height }: Props) {
  return (
    <textarea
      ref={textareaRef}
      value={value}
      placeholder="Tulis pesan..."
      aria-label="Chat input"
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      className={`
          w-full px-4 py-2.5 text-sm font-mono
          bg-(--background) text-white outline-none resize-none
          leading-[1.45] min-h-[42px] max-h-[300px] overflow-y-auto
          border border-gray-500/40 shadow-inner transition-all duration-150

          ${
            height < 52
              ? "rounded-full"
              : height < 120
              ? "rounded-2xl"
              : "rounded-xl"
          }
        `}
      style={{ height }}
    />
  );
}
