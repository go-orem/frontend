"use client";

import React, { useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WebRTCProvider, WebRTCContext } from "./webrtc/WebRTCProvider";
import { CallRoot } from "./webrtc/CallRoot";

interface CallLauncherProps {
  open: boolean;
  onClose: () => void;
}

export default function CallLauncher({ open, onClose }: CallLauncherProps) {
  if (!open) return null;
  return (
    <WebRTCProvider>
      <InnerLauncher onClose={onClose} />
    </WebRTCProvider>
  );
}

function InnerLauncher({ onClose }: { onClose: () => void }) {
  const ctx = React.useContext(WebRTCContext) as any;
  const backdropCls = ctx?.showPiP
    ? "bg-transparent pointer-events-auto"
    : "bg-(--background)/30 backdrop-blur-[48px]";

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${backdropCls}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="relative w-[94%] max-w-5xl h-[700px] bg-linear-to-tl from-white/5 via-white/10 to-white/5 backdrop-blur-3xl border border-white/10 rounded-[36px] shadow-[0_20px_40px_rgba(0,0,0,0.25)] overflow-hidden"
        >
          <ModalInner onClose={onClose} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ModalInner({ onClose }: { onClose: () => void }) {
  const ctx = useContext(WebRTCContext) as any;

  useEffect(() => {
    ctx?.startLocal?.();

    let t1: any = null;
    let t2: any = null;
    if (ctx && ctx.callState === "idle") {
      try {
        ctx.setCallState?.("ringing");
        t1 = setTimeout(() => {
          ctx.setCallState?.("connecting");
          t2 = setTimeout(() => {
            if (!ctx.remoteStream && ctx.localStream) {
              ctx.setRemoteStream?.(ctx.localStream);
            }
            ctx.setCallState?.("connected");
          }, 1200);
        }, 1200);
      } catch (e) {}
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ctx?.endCall?.();
    };
  }, []);

  const handleClose = () => {
    ctx?.endCall?.();
    onClose();
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full h-20 z-20 flex items-center justify-between px-6 bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-3xl border-b border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,200,0.3)] animate-pulse">
            <img
              src="/api/avatar/user1.png"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-white font-bold text-lg drop-shadow-md font-mono">Syarifa</p>
            <span className="text-sm text-green-400 font-semibold animate-pulse font-mono">Calling…</span>
          </div>
        </div>
        <div>
          <button
            onClick={handleClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 shadow-md"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 pt-20 pb-24">
        <CallRoot onClose={handleClose} />
      </div>
    </div>
  );
}
