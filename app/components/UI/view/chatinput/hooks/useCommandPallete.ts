// useCommandPalette.ts
import { useState, useCallback } from "react";

export type Cmd = { id: string; title: string; run: (arg?:string)=>string };

export function useCommandPalette(initial: Cmd[] = []) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Cmd[]>(initial);

  const filtered = items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.id.includes(query));

  const register = useCallback((cmd: Cmd) => setItems(prev => [...prev, cmd]), []);
  const run = useCallback((id:string, arg?:string) => {
    const c = items.find(x=>x.id===id);
    if(!c) return null;
    return c.run(arg);
  }, [items]);

  return { open, setOpen, query, setQuery, filtered, register, run };
}
