"use client";

import React, { useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WebRTCProvider, WebRTCContext } from "./webrtc/WebRTCProvider";
import { CallRoot } from "./webrtc/CallRoot";

interface CallLauncherProps {
  open: boolean;
  onClose: () => void;
  conversationId?: string; // ✅ Add conversation ID
}

export default function CallLauncher({
  open,
  onClose,
  conversationId,
}: CallLauncherProps) {
  if (!open) return null;
  return (
    <WebRTCProvider conversationId={conversationId}>
      <InnerLauncher onClose={onClose} />
    </WebRTCProvider>
  );
}

function InnerLauncher({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black"
      >
        <ModalInner onClose={onClose} />
      </motion.div>
    </AnimatePresence>
  );
}

function ModalInner({ onClose }: { onClose: () => void }) {
  const ctx = useContext(WebRTCContext) as any;

  useEffect(() => {
    // Start local camera
    ctx?.startLocal?.();

    return () => {
      ctx?.endCall?.();
    };
  }, [ctx]);

  const handleClose = () => {
    ctx?.endCall?.();
    onClose();
  };

  return (
    <div className="w-full h-full relative">
      <CallRoot onClose={handleClose} />
    </div>
  );
}
