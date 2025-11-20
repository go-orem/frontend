"use client";
import React, { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { TextareaCore, DropdownMenu, PasteBanner } from "./components";
import { useAutoResize } from "./hooks/useAutoResize";
import { useAutocomplete } from "./hooks/useAutocomplate";
import { usePasteHandler } from "./hooks/usePasteHandler";
import { MENTIONS, SLASH_CMDS, LANGS, EMOJIS } from "./constants";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
};

export default function TextareaChat({ value, onChange, onEnter }: Props) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const { height, autoResize, computeDropClass, setHeight } = useAutoResize(taRef);

  const {
    mentionOpen, slashOpen, emojiOpen, langOpen,
    mentionList, slashList, emojiList, langList,
    highlightIndex, setHighlightIndex,
    handleChange: acHandleChange, handleKey: acHandleKey,
    selectMention, runSlash, selectEmoji, selectLang, closeAll
  } = useAutocomplete(taRef, value, onChange, autoResize);

  const {
    pasteCandidate, pasteIsCodeLike, onPaste: phOnPaste,
    acceptPasteAsCode: phAcceptPasteAsCode, rejectPasteAsCode: phRejectPasteAsCode
  } = usePasteHandler();

  const handleChange = (text: string) => acHandleChange(text);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => acHandleKey(e, onEnter);

  // replaceRange is still useful for paste handler results
  const replaceRange = (text: string, start: number, end: number, insert: string) =>
    text.slice(0, start) + insert + text.slice(end);

  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => phOnPaste(e, taRef);

  const acceptPasteAsCode = () => {
    const res = phAcceptPasteAsCode(value, replaceRange, onChange, taRef) as any;
    if (!res) return;
    closeAll();
    requestAnimationFrame(() => {
      taRef.current?.focus();
      taRef.current?.setSelectionRange(res.pos, res.pos);
      autoResize();
    });
  };

  const rejectPasteAsCode = () => {
    const res = phRejectPasteAsCode(value, replaceRange, onChange, taRef) as any;
    if (!res) return;
    closeAll();
    requestAnimationFrame(() => {
      taRef.current?.focus();
      taRef.current?.setSelectionRange(res.pos, res.pos);
      autoResize();
    });
  };

  const dropCls = computeDropClass();

  useEffect(() => {
    if (value.trim() === "") {
      setHeight(42);
    }
  }, [value, setHeight]);

  return (
    <div className="relative w-full">

      <AnimatePresence>
        <PasteBanner pasteCandidate={pasteCandidate} accept={acceptPasteAsCode} reject={rejectPasteAsCode} />
      </AnimatePresence>

      <TextareaCore textareaRef={taRef} value={value} onChange={handleChange} onKeyDown={handleKey} onPaste={onPaste} height={height} />

      <AnimatePresence>
        <DropdownMenu
          mentionOpen={mentionOpen}
          slashOpen={slashOpen}
          emojiOpen={emojiOpen}
          langOpen={langOpen}
          dropCls={dropCls}
          mentionList={mentionList}
          slashList={slashList}
          emojiList={emojiList}
          langList={langList}
          highlightIndex={highlightIndex}
          onSelectMention={selectMention}
          onRunSlash={runSlash}
          onSelectEmoji={selectEmoji}
          onSelectLang={selectLang}
        />
      </AnimatePresence>
    </div>
  );
}
