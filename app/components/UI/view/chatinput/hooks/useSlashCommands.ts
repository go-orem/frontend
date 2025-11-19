// useSlashCommands.ts
import { useCallback } from "react";

export const SLASH_DEFAULTS = [
  { id: "gpt", out: "/gpt", desc: "Ask GPT for help" },
  { id: "shrug", out: "¯\\_(ツ)_/¯", desc: "Insert shrug" },
  { id: "image", out: "/image ", desc: "Generate image" },
];

export function useSlashCommands() {
  const matchAndRun = useCallback((text: string, cmdId: string) => {
    const cmd = SLASH_DEFAULTS.find(c => c.id === cmdId);
    if (!cmd) return null;
    // example: /image foo -> we return replacement text
    if (cmd.id === "image") {
      return `${cmd.out}${text}`; // caller decides what to do
    }
    return cmd.out;
  }, []);
  return { list: SLASH_DEFAULTS, matchAndRun };
}
