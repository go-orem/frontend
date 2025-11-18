import { useState } from "react";

export function useAutoResize(ref: React.RefObject<HTMLTextAreaElement | null>) {
  const [height, setHeight] = useState(42);

  const autoResize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, 600);
    el.style.height = newHeight + "px";
    setHeight(newHeight);
  };

  const computeDropClass = () => {
    const el = ref.current;
    if (!el) return "bottom-[110%]";
    const rect = el.getBoundingClientRect();
    const enoughBelow = rect.bottom + 250 < window.innerHeight;
    return enoughBelow ? "top-[110%]" : "bottom-[110%]";
  };

  return { height, autoResize, computeDropClass, setHeight } as const;
}
