"use client";
import React from "react";
import { motion } from "framer-motion";
import { WebRTCContext } from "../webrtc/WebRTCProvider";
import PiPFloating from "../webrtc/PiP";
import { CallControls } from "./CallControls";

export function CallConnected({ onClose }: { onClose?: () => void }) {
  // 🔥 Panggil sekali saja!!!
  const webrtc = React.useContext(WebRTCContext) as any;

  const {
    localVideo,
    remoteVideo,
    canvasRef,
    useBlur,
    virtualBg,
    localStream,
    remoteStream,
    showPiP,
    setShowPiP,
  } = webrtc;

  return (
    <div className="relative w-full h-full text-white  overflow-hidden">
      {/* remote stream */}
      <video
        ref={remoteVideo}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* background effects overlay (canvas segmentation) */}
      {(useBlur || virtualBg) && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      {/* local preview */}
      <motion.video
        ref={localVideo}
        autoPlay
        playsInline
        muted
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute bottom-0 right-6 w-48 h-32 rounded-xl shadow-xl object-cover z-20 pointer-events-none"
      />

      <CallControls />

      {/* PiP Floating */}
      {showPiP && (
        <PiPFloating stream={localStream} onClose={() => setShowPiP?.(false)} />
      )}
    </div>
  );
}
