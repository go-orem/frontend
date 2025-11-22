"use client";

import React, { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WebRTCContext } from "./WebRTCProvider";

type Props = {
  stream: MediaStream | null;
  onClose?: () => void;
};

export default function PiPFloating({ stream, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  // initialize at bottom-right
  useEffect(() => {
    const margin = 24;
    const w = window.innerWidth;
    const h = window.innerHeight;
    setPos({ x: w - 160 - margin, y: h - 120 - margin });
  }, []);

  // attach stream to video element
  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
    if (videoRef.current) videoRef.current.muted = muted;
  }, [stream, muted]);

  // drag handlers
  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    let startX = 0,
      startY = 0,
      origX = 0,
      origY = 0;

    const onPointerDown = (e: PointerEvent) => {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      setIsDragging(true);
      startX = e.clientX;
      startY = e.clientY;
      origX = pos.x;
      origY = pos.y;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      setPos({ x: Math.max(8, origX + dx), y: Math.max(8, origY + dy) });
    };
    const onPointerUp = () => {
      setIsDragging(false);
      setTimeout(() => snapToCorner(), 30);
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging, pos]);

  // PiP context sync
  const ctx = useContext(WebRTCContext) as any;
  useEffect(() => {
    const v = videoRef.current as any;
    if (!v) return;
    const onEnter = () => ctx?.setShowPiP?.(true);
    const onLeave = () => ctx?.setShowPiP?.(false);
    v.addEventListener?.("enterpictureinpicture", onEnter);
    v.addEventListener?.("leavepictureinpicture", onLeave);
    return () => {
      v.removeEventListener?.("enterpictureinpicture", onEnter);
      v.removeEventListener?.("leavepictureinpicture", onLeave);
    };
  }, [videoRef.current]);

  const snapToCorner = () => {
    const el = nodeRef.current;
    if (!el) return;
    const rectW = el.clientWidth || 160;
    const rectH = el.clientHeight || 120;
    const margin = 12;
    const w = window.innerWidth - rectW - margin;
    const h = window.innerHeight - rectH - margin;
    const corners = [
      { x: margin, y: margin },
      { x: w, y: margin },
      { x: margin, y: h },
      { x: w, y: h },
    ];
    let best = corners[0];
    let bestD = Infinity;
    corners.forEach((c) => {
      const dx = c.x - pos.x;
      const dy = c.y - pos.y;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    });
    setPos(best);
  };

  const toggleMute = () => {
    setMuted((m) => {
      const nm = !m;
      if (videoRef.current) videoRef.current.muted = nm;
      return nm;
    });
  };

  const togglePause = () => {
    setPaused((p) => {
      const np = !p;
      if (videoRef.current) {
        if (np) videoRef.current.pause();
        else videoRef.current.play().catch(() => {});
      }
      return np;
    });
  };

  if (!stream || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={nodeRef}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 250, damping: 22 }}
        style={{ position: "fixed", left: 0, top: 0, touchAction: "none", zIndex: 50 }}
      >
        <div
          className="w-40 h-28 rounded-2xl overflow-hidden shadow-2xl border border-white/12 bg-white/5 backdrop-blur-3xl relative"
        >
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="object-cover w-full h-full pointer-events-none rounded-2xl"
          />

          {/* Controls */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={togglePause}
              className="bg-white/10 hover:bg-white/20 p-1 rounded-md text-white text-xs"
            >
              {paused ? "▶" : "⏸"}
            </button>
            <button
              onClick={toggleMute}
              className="bg-white/10 hover:bg-white/20 p-1 rounded-md text-white text-xs"
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={() => {
                setVisible(false);
                onClose?.();
              }}
              className="bg-white/10 hover:bg-white/20 p-1 rounded-md text-white text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
