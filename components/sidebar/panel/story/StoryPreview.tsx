"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export type StoryItem = {
  id: number;
  username: string;
  timestamp?: string;
  status?: string;
  type?: string;
  image?: string;
  text?: string;
  verified?: boolean;
  pinned?: boolean;
};

export default function StoryPreview({
  stories,
  startIndex = 0,
  onClose,
}: {
  stories: StoryItem[];
  startIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [playing, setPlaying] = useState(true);
  const [showNav, setShowNav] = useState(true);
  const [zoomPan, setZoomPan] = useState(false);
  const [contentMaxWidth, setContentMaxWidth] = useState<number>(1200);
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Normalize stories: provide a safe fallback so component never crashes
  const localStories: StoryItem[] = Array.isArray(stories) && stories.length > 0
    ? stories
    : [{ id: startIndex ?? 0, username: "Story", timestamp: "", type: "photo" }];

  // ensure index stays in range if provided startIndex was out-of-bounds
  useEffect(() => {
    if (index < 0 || index >= localStories.length) {
      setIndex(Math.max(0, Math.min(index, localStories.length - 1)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStories.length]);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    if (playing) startAuto();
    // lock body scroll while preview is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // keyboard navigation
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevItem();
      if (e.key === "ArrowRight") nextItem();
      if (e.key === " ") setPlaying((p) => !p);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      stopAuto();
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing]);

  const startAuto = () => {
    stopAuto();
    timerRef.current = window.setTimeout(() => setIndex((i) => (i + 1) % localStories.length), 4500);
    if (progressRef.current) {
      progressRef.current.style.transition = "width 4.5s linear";
      // force reflow for consistent animation restart
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      progressRef.current.offsetWidth;
      progressRef.current.style.width = "100%";
    }
  };
  const stopAuto = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (progressRef.current) {
      progressRef.current.style.transition = "none";
      progressRef.current.style.width = "0%";
    }
  };

  const prevItem = () => {
    setIndex((i) => (i - 1 + localStories.length) % localStories.length);
  };
  const nextItem = () => {
    setIndex((i) => (i + 1) % localStories.length);
  };

  const cur = localStories[index] || localStories[0];

  return (
    <AnimatePresence>
      <motion.div
        key="story-preview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        <motion.div
          className="absolute inset-0 bg-(--background) backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-60 w-full h-full flex flex-col"
        >
          {/* Top controls */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {cur.username?.charAt(0) || "U"}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{cur.username}</div>
                <div className="text-xs text-gray-400">{cur.timestamp}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {showNav && (
                <button onClick={() => { prevItem(); setPlaying(true); }} aria-label="Previous" className="p-3 rounded-full hover:bg-white/5 text-white">
                  <ChevronLeft size={20} />
                </button>
              )}
              <button onClick={() => setPlaying((p) => !p)} aria-label="Play/Pause" className="p-3 rounded-full hover:bg-white/5 text-white">
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              {showNav && (
                <button onClick={() => { nextItem(); setPlaying(true); }} aria-label="Next" className="p-3 rounded-full hover:bg-white/5 text-white">
                  <ChevronRight size={20} />
                </button>
              )}
              <button onClick={onClose} aria-label="Close preview" className="p-3 rounded-full hover:bg-white/5 text-gray-300">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="h-1 bg-white/6">
            <div ref={progressRef} className="h-1 bg-teal-400 w-0" />
          </div>

          {/* Option panel (user-requested choices) */}
          <div className="px-6 pt-4 pb-2 flex items-center gap-4">
            <div className="text-sm text-gray-300">Options:</div>
            <button
              onClick={() => setShowNav((s) => !s)}
              className={`px-3 py-1 rounded-full text-sm ${showNav ? 'bg-white/10 text-white' : 'bg-white/3 text-gray-300'}`}
            >
              Sembunyikan prev/next
            </button>
            <button
              onClick={() => setZoomPan((z) => !z)}
              className={`px-3 py-1 rounded-full text-sm ${zoomPan ? 'bg-white/10 text-white' : 'bg-white/3 text-gray-300'}`}
            >
              Toggle zoom/pan
            </button>
            <div className="flex items-center gap-2 ml-3">
              <button
                onClick={() => setContentMaxWidth((w) => Math.max(600, w - 100))}
                className="px-2 py-1 rounded bg-white/3 text-gray-200"
              >-</button>
              <div className="text-xs text-gray-300">Size</div>
              <button
                onClick={() => setContentMaxWidth((w) => Math.min(1600, w + 100))}
                className="px-2 py-1 rounded bg-white/3 text-gray-200"
              >+</button>
            </div>
          </div>

          {/* Fullscreen content */}
          <div className="flex-1 flex items-center justify-center px-6 py-8">
            <div className="w-full h-full max-h-screen mx-auto flex items-center justify-center" style={{ maxWidth: contentMaxWidth }}>
              {cur.image ? (
                zoomPan ? (
                  <motion.img
                    src={cur.image}
                    alt={cur.username}
                    className="w-full h-full object-contain rounded-md"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.03 }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  />
                ) : (
                  <img src={cur.image} alt={cur.username} className="w-full h-full object-contain rounded-md" />
                )
              ) : (
                <div className="text-center text-gray-200 p-8 bg-black/40 rounded-md">{cur.text || 'No preview available'}</div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
