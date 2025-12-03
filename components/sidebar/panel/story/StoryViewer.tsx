"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Send,
  MessageCircle,
} from "lucide-react";

type StoryItem = {
  id: number;
  username: string;
  avatar: string;
  media: string;
  type: "image" | "video";
  caption?: string;
  timestamp: string;
  duration?: number;
};

export default function StoryViewer({
  storyList,
  startIndex,
  onClose,
}: {
  storyList: StoryItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<any>(null);

  const current = storyList[index];

  const DURATION = current.duration ?? 6500; // milliseconds

  // === Start Progress Animation ===
  useEffect(() => {
    setProgress(0);
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          handleNext();
          return 0;
        }
        return p + 0.8;
      });
    }, DURATION / 120);

    return () => clearInterval(intervalRef.current);
  }, [index]);

  // === Navigation ===
  const handleNext = () => {
    if (index < storyList.length - 1) {
      setIndex(index + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  // === Tap Navigation ===
  const handleTap = (e: any) => {
    const x = e.clientX;
    if (x < window.innerWidth / 2) handlePrev();
    else handleNext();
  };

  // === Swipe Support ===
  const startX = useRef(0);
  const endX = useRef(0);

  const handleTouchStart = (e: any) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: any) => {
    endX.current = e.changedTouches[0].clientX;
    if (startX.current - endX.current > 50) handleNext();
    if (endX.current - startX.current > 50) handlePrev();
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-99 flex items-center justify-center"
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
      >
        <X size={22} />
      </button>

      {/* TOP USER INFO */}
      <div className="absolute top-5 left-5 flex items-center gap-3">
        <img
          src={current.avatar}
          className="w-10 h-10 rounded-full border border-white/40"
        />
        <div>
          <p className="text-white font-semibold">{current.username}</p>
          <p className="text-xs text-gray-300">{current.timestamp}</p>
        </div>
      </div>

      {/* PROGRESS BARS */}
      <div className="absolute top-0 w-full px-4 pt-3 space-y-1">
        <div className="flex gap-2">
          {storyList.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full bg-white/20 overflow-hidden flex-1"
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{
                  width: i === index ? `${progress}%` : i < index ? "100%" : "0%",
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* MEDIA DISPLAY */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="max-h-[88vh] max-w-[80vw] rounded-2xl overflow-hidden shadow-xl"
        >
          {current.type === "image" ? (
            <img src={current.media} className="object-cover" />
          ) : (
            <video
              src={current.media}
              autoPlay
              muted
              playsInline
              className="object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* CAPTION */}
      {current.caption && (
        <div className="absolute bottom-28 px-6 text-center w-full">
          <p className="text-white text-lg drop-shadow-md">{current.caption}</p>
        </div>
      )}

      {/* REACTIONS */}
      <div className="absolute bottom-14 w-full flex items-center justify-center gap-4">
        {["👍", "❤️", "🔥", "😮", "😂"].map((icon) => (
          <motion.button
            key={icon}
            whileTap={{ scale: 0.8 }}
            className="text-3xl"
          >
            {icon}
          </motion.button>
        ))}
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="absolute bottom-5 w-full px-6 flex items-center justify-between">
        <button className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white">
          <MessageCircle size={18} />
          Reply
        </button>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-white/10 text-white">
            <Send size={18} />
          </button>
          <button className="p-2 rounded-full bg-white/10 text-white">
            <Download size={18} />
          </button>

          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-white/10 text-white"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white/10 text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
