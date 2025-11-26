import { useState, useCallback } from "react";
import { MENTIONS, SLASH_CMDS, EMOJIS, LANGS } from "../constants";
import { useMentionFetch } from "./useMentionFetch";
import { useSlashCommands } from "./useSlashCommands";

type ReplaceRangeFn = (
  text: string,
  start: number,
  end: number,
  insert: string
) => string;

export function useAutocomplete(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  onChange: (v: string) => void,
  autoResize: () => void
) {
  // states
  const [mentionOpen, setMentionOpen] = useState(false);
  const [slashOpen, setSlashOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const [mentionList, setMentionList] = useState<typeof MENTIONS>([]);
  const [slashList, setSlashList] = useState<typeof SLASH_CMDS>([]);
  const [emojiList, setEmojiList] = useState<typeof EMOJIS>([]);
  const [langList, setLangList] = useState<string[]>(LANGS);

  const [highlightIndex, setHighlightIndex] = useState(0);

  // helper: token before caret
  const tokenBeforeCaret = useCallback((text: string, caret: number) => {
    const left = text.slice(0, caret);
    const m = /([^\s]*)$/.exec(left);
    return m ? m[1] : "";
  }, []);

  const closeAll = useCallback(() => {
    setMentionOpen(false);
    setSlashOpen(false);
    setEmojiOpen(false);
    setLangOpen(false);
  }, []);

  // --- Fix utama ---
  const mentionFetch = useMentionFetch(async (q: string) => {
  // tambahkan id = name atau id unik lain sesuai data
  return MENTIONS
    .filter((m) => m.name.toLowerCase().startsWith(q.toLowerCase()))
    .map((m) => ({
      id: m.name, 
      name: m.name,
      avatar: m.avatar,
    }));
});


  const slashCmds = useSlashCommands();

  const handleChange = useCallback(
    (text: string) => {
      onChange(text);
      autoResize();
      setHighlightIndex(0);

      const caret = ref.current?.selectionStart ?? text.length;
      const token = tokenBeforeCaret(text, caret);

      // mentions
      const mentionMatch = /@([a-zA-Z0-9_]*)$/.exec(token);
      if (mentionMatch) {
        const q = mentionMatch[1].toLowerCase();
        if (q.length >= 1) {
          mentionFetch.fetch(q).then((items) => setMentionList(items as any));
        } else {
          setMentionList(MENTIONS.filter((m) => m.name.startsWith(q)));
        }
        setMentionOpen(true);
        setSlashOpen(false);
        setEmojiOpen(false);
        setLangOpen(false);
        return;
      }
      setMentionOpen(false);

      // slash
      const slashMatch = /\/([a-zA-Z0-9_-]*)$/.exec(token);
      if (slashMatch) {
        const q = slashMatch[1].toLowerCase();
        setSlashList(SLASH_CMDS.filter((c) => c.id.startsWith(q)));
        setSlashOpen(true);
        setMentionOpen(false);
        setEmojiOpen(false);
        setLangOpen(false);
        return;
      }
      setSlashOpen(false);

      // emoji
      const emojiMatch = /:([a-zA-Z0-9_]*)$/.exec(token);
      if (emojiMatch) {
        const q = emojiMatch[1].toLowerCase();
        setEmojiList(EMOJIS.filter((e) => e.key.startsWith(q)));
        setEmojiOpen(true);
        setMentionOpen(false);
        setSlashOpen(false);
        setLangOpen(false);
        return;
      }
      setEmojiOpen(false);

      // language after ```
      const before = text.slice(0, caret);
      if (before.endsWith("```")) {
        setLangOpen(true);
        setMentionOpen(false);
        setSlashOpen(false);
        setEmojiOpen(false);
        return;
      }
      setLangOpen(false);
    },
    [ref, onChange, autoResize, tokenBeforeCaret, mentionFetch]
  );

  const replaceRange: ReplaceRangeFn = (text, start, end, insert) =>
    text.slice(0, start) + insert + text.slice(end);

  const selectMention = useCallback(
    (name?: string) => {
      if (!name) return;
      const el = ref.current;
      if (!el) return;
      const caret = el.selectionStart ?? value.length;
      const left = value.slice(0, caret);
      const m = /@([a-zA-Z0-9_]*)$/.exec(left);
      if (!m) return;
      const start = caret - m[0].length;
      const newText = replaceRange(value, start, caret, `@${name} `);
      onChange(newText);
      closeAll();
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(
          start + `@${name} `.length,
          start + `@${name} `.length
        );
        autoResize();
      });
    },
    [ref, value, onChange, autoResize, closeAll]
  );

  const runSlash = useCallback(
    (cmd?: any) => {
      if (!cmd) return;
      const el = ref.current;
      if (!el) return;
      const caret = el.selectionStart ?? value.length;
      const left = value.slice(0, caret);
      const m = /\/([a-zA-Z0-9_-]*)$/.exec(left);
      if (!m) return;
      const start = caret - m[0].length;
      const insertText = slashCmds.matchAndRun("", cmd.id) ?? cmd.out;
      const newText = replaceRange(value, start, caret, insertText + " ");
      onChange(newText);
      closeAll();
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(
          start + insertText.length + 1,
          start + insertText.length + 1
        );
        autoResize();
      });
    },
    [ref, value, onChange, autoResize, closeAll, slashCmds]
  );

  const selectEmoji = useCallback(
    (char?: string) => {
      if (!char) return;
      const el = ref.current;
      if (!el) return;
      const caret = el.selectionStart ?? value.length;
      const left = value.slice(0, caret);
      const m = /:([a-zA-Z0-9_]*)$/.exec(left);
      if (!m) return;
      const start = caret - m[0].length;
      const newText = replaceRange(value, start, caret, char + " ");
      onChange(newText);
      closeAll();
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + char.length + 1, start + char.length + 1);
        autoResize();
      });
    },
    [ref, value, onChange, autoResize, closeAll]
  );

  const selectLang = useCallback(
    (lang?: string) => {
      if (!lang) return;
      const el = ref.current;
      if (!el) return;
      const caret = el.selectionStart ?? value.length;
      const left = value.slice(0, caret);
      const m = /```$/.exec(left);
      if (!m) return;
      const start = caret - 3;
      const snippet = `\`\`\`${lang}\n\n\`\`\`\n`;
      const newText = replaceRange(value, start, caret, snippet);
      onChange(newText);
      closeAll();
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(
          start + `\`\`\`${lang}\n`.length,
          start + `\`\`\`${lang}\n`.length
        );
        autoResize();
      });
    },
    [ref, value, onChange, autoResize, closeAll]
  );

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>, onEnter: () => void) => {
      const activeList = mentionOpen
        ? mentionList
        : slashOpen
        ? slashList
        : emojiOpen
        ? emojiList
        : langOpen
        ? langList
        : [];

      if (activeList.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightIndex((i) => (i + 1) % activeList.length);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightIndex(
            (i) => (i - 1 + activeList.length) % activeList.length
          );
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (mentionOpen) selectMention(mentionList[highlightIndex]?.name);
          else if (slashOpen) runSlash(slashList[highlightIndex]);
          else if (emojiOpen) selectEmoji(emojiList[highlightIndex]?.char);
          else if (langOpen) selectLang(langList[highlightIndex]);
          return;
        }
      }

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onEnter();
        onChange("");
        closeAll();
      }
    },
    [
      mentionOpen,
      slashOpen,
      emojiOpen,
      langOpen,
      mentionList,
      slashList,
      emojiList,
      langList,
      highlightIndex,
      selectMention,
      runSlash,
      selectEmoji,
      selectLang,
      onChange,
      closeAll,
    ]
  );

  return {
    mentionOpen,
    slashOpen,
    emojiOpen,
    langOpen,
    mentionList,
    slashList,
    emojiList,
    langList,
    highlightIndex,
    setHighlightIndex,
    handleChange,
    handleKey,
    selectMention,
    runSlash,
    selectEmoji,
    selectLang,
    closeAll,
  } as const;
}
