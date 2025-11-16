"use client";
import React, { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface DynamicEmojiButtonProps {
  showEmoji: boolean;
  toggleEmoji: () => void;
  // Customization
  emojiList?: string[];
  intervalMs?: number;
  random?: boolean;
  pauseWhileOpen?: boolean;
  className?: string;
  sizePx?: number;
  transitionMs?: number;
}

const defaultEmojis = [
  "/animations/LMAO.lottie",
  "/animations/1.lottie",
  "/animations/2.lottie",
  "/animations/3.lottie",
  "/animations/4.lottie",
  "/animations/5.lottie",
];

export default function DynamicEmojiButton({
  showEmoji,
  toggleEmoji,
  emojiList = defaultEmojis,
  intervalMs = 2000,
  random = true,
  pauseWhileOpen = true,
  className = "",
  sizePx = 28,
  transitionMs = 300,
}: DynamicEmojiButtonProps) {
  // index of currently-visible animation in emojiList
  const [currentIndex, setCurrentIndex] = useState(0);
  // index of the incoming animation during transition
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const lastIndexRef = useRef<number>(0);

  // choose next index (random/no-repeat or sequential)
  const pickNext = (cur: number) => {
    const n = emojiList.length;
    if (n <= 1) return cur;
    if (!random) return (cur + 1) % n;

    // random but avoid immediate repeat
    let next = Math.floor(Math.random() * n);
    let attempts = 0;
    while (next === cur && attempts < 6) {
      next = Math.floor(Math.random() * n);
      attempts++;
    }
    return next;
  };

  // start interval that triggers transitions
  useEffect(() => {
    mountedRef.current = true;
    const start = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        if (pauseWhileOpen && showEmoji) return;
        if (!mountedRef.current) return;
        if (isTransitioning) return;

        const next = pickNext(lastIndexRef.current);
        if (next === lastIndexRef.current) return;
        setIncomingIndex(next);
        setIsTransitioning(true);
        // after transition completes, commit
        window.setTimeout(() => {
          if (!mountedRef.current) return;
          setCurrentIndex(next);
          lastIndexRef.current = next;
          setIncomingIndex(null);
          setIsTransitioning(false);
        }, transitionMs);
      }, intervalMs);
    };

    start();

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [emojiList, intervalMs, random, pauseWhileOpen, showEmoji, transitionMs]);

  useEffect(() => {
    lastIndexRef.current = currentIndex;
  }, [currentIndex]);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (!mountedRef.current) return;

    intervalRef.current = window.setInterval(() => {
      if (pauseWhileOpen && showEmoji) return;
      if (isHovered) return;
      if (isTransitioning) return;

      const next = pickNext(lastIndexRef.current);
      if (next === lastIndexRef.current) return;
      setIncomingIndex(next);
      setIsTransitioning(true);
      window.setTimeout(() => {
        if (!mountedRef.current) return;
        setCurrentIndex(next);
        lastIndexRef.current = next;
        setIncomingIndex(null);
        setIsTransitioning(false);
      }, transitionMs);
    }, intervalMs);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isHovered,
    showEmoji,
    intervalMs,
    random,
    pauseWhileOpen,
    transitionMs,
    emojiList,
  ]);

  // Small helper for inline styles controlling crossfade
  const sizeStyle = { width: `${sizePx}px`, height: `${sizePx}px` };

  return (
    <button
      type="button"
      aria-label="Toggle emoji"
      className={`relative overflow-visible text-xl pb-1.5 cursor-pointer transition-transform duration-200 ${className} ${
        showEmoji ? "scale-125" : "scale-100"
      }`}
      onClick={toggleEmoji}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* container that holds two stacked Lottie players for crossfade */}
      <div
        className="relative"
        style={{
          width: sizePx,
          height: sizePx,
        }}
      >
        {/* Current (visible) layer */}
        <div
          className="absolute inset-0 transition-opacity"
          style={{
            opacity: isTransitioning && incomingIndex !== null ? 0 : 1,
            transitionDuration: `${transitionMs}ms`,
            ...sizeStyle,
          }}
        >
          <DotLottieReact
            src={emojiList[currentIndex]}
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Incoming layer (fades in) */}
        {incomingIndex !== null && (
          <div
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: isTransitioning ? 1 : 0,
              transitionDuration: `${transitionMs}ms`,
              ...sizeStyle,
            }}
          >
            <DotLottieReact
              src={emojiList[incomingIndex]}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}
      </div>
    </button>
  );
}
