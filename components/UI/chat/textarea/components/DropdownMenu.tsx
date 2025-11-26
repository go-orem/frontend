import React from "react";

type Mention = { name: string; avatar: string };
type SlashCmd = { id: string; out: string; desc: string };
type Emoji = { key: string; char: string };

type Props = {
  mentionOpen: boolean;
  slashOpen: boolean;
  emojiOpen: boolean;
  langOpen: boolean;
  dropCls: string;
  mentionList: Mention[];
  slashList: SlashCmd[];
  emojiList: Emoji[];
  langList: string[];
  highlightIndex: number;
  onSelectMention: (name: string) => void;
  onRunSlash: (cmd: SlashCmd) => void;
  onSelectEmoji: (char: string) => void;
  onSelectLang: (lang: string) => void;
};

export default function DropdownMenu({
  mentionOpen,
  slashOpen,
  emojiOpen,
  langOpen,
  dropCls,
  mentionList,
  slashList,
  emojiList,
  langList,
  highlightIndex,
  onSelectMention,
  onRunSlash,
  onSelectEmoji,
  onSelectLang,
}: Props) {
  if (!(mentionOpen || slashOpen || emojiOpen || langOpen)) return null;

  return (
    <div
      className={`absolute left-2 ${dropCls} w-[280px] bg-[#0F0F10]/30 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl  z-50`}
    >
      {mentionOpen &&
        mentionList.map((m, i) => (
          <button
            type="button"
            key={m.name}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelectMention(m.name);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${
              highlightIndex === i
                ? "bg-gray-800 scale-[1.02]"
                : "hover:bg-gray-800"
            } transition-all`}
          >
            <img
              src={m.avatar}
              alt={`@${m.name}`}
              className="w-7 h-7 rounded-full"
            />
            <div className="text-gray-200 text-sm">@{m.name}</div>
          </button>
        ))}

      {slashOpen &&
        slashList.map((s, i) => (
          <button
            type="button"
            key={s.id}
            onMouseDown={(e) => {
              e.preventDefault();
              onRunSlash(s);
            }}
            className={`w-full px-3 py-2 rounded-md text-left ${
              highlightIndex === i
                ? "bg-gray-800 scale-[1.02]"
                : "hover:bg-gray-800"
            } transition-all`}
          >
            <div className="text-gray-200 text-sm">/{s.id}</div>
            <div className="text-xs text-gray-400">{s.desc}</div>
          </button>
        ))}

      {emojiOpen &&
        emojiList.map((em, i) => (
          <button
            type="button"
            key={em.key}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelectEmoji(em.char);
            }}
            className={`w-full px-3 py-2 rounded-md ${
              highlightIndex === i
                ? "bg-gray-800 scale-[1.02]"
                : "hover:bg-gray-800"
            } transition-all`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{em.char}</span>
              <div className="text-gray-200 text-sm">:{em.key}</div>
            </div>
          </button>
        ))}

      {langOpen &&
        langList.map((lang, i) => (
          <button
            type="button"
            key={lang}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelectLang(lang);
            }}
            className={`w-full px-3 py-2 rounded-md ${
              highlightIndex === i
                ? "bg-gray-800 scale-[1.02]"
                : "hover:bg-gray-800"
            } transition-all`}
          >
            <div className="text-gray-200 text-sm">{lang}</div>
          </button>
        ))}
    </div>
  );
}
