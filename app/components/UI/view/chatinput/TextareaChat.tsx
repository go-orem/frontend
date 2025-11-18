"use client";
import React, { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { TextareaCore, DropdownMenu, PasteBanner } from "./components";
import { useAutoResize } from "./hooks/useAutoResize";
import { useAutocomplete } from "./hooks/useAutocomplate"; // pastikan nama file benar
import { usePasteHandler } from "./hooks/usePasteHandler";
import { useSyntaxHighlight } from "./hooks/useSyntaxHighlight"; // hook XSS-safe
import { MENTIONS, SLASH_CMDS, LANGS, EMOJIS } from "./constants";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
};

export default function TextareaChat({ value, onChange, onEnter }: Props) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const { highlight } = useSyntaxHighlight();

  const { height, autoResize, computeDropClass } = useAutoResize(taRef);

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

  // handle change & keydown
  const handleChange = (text: string) => acHandleChange(text);
  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => acHandleKey(e, onEnter);

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

  return (
    <div className="relative w-full">
      {/* Banner untuk paste */}
      <AnimatePresence>
        <PasteBanner
          pasteCandidate={pasteCandidate}
          accept={acceptPasteAsCode}
          reject={rejectPasteAsCode}
        />
      </AnimatePresence>

      {/* Preview kode XSS-safe */}
      {pasteCandidate && pasteIsCodeLike && (
        <pre className="bg-(--background) text-white p-2 rounded overflow-x-auto mb-2">
          <code dangerouslySetInnerHTML={{ __html: highlight(pasteCandidate) }} />
        </pre>
      )}

      {/* Textarea input */}
      <TextareaCore
        textareaRef={taRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKey}
        onPaste={onPaste}
        height={height}
      />

      {/* Dropdown untuk mentions / slash / emoji / bahasa */}
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
