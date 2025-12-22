"use client";
import React from "react";
import { WebRTCContext } from "../webrtc/WebRTCProvider";

export function CallRinging({ onClose }: { onClose?: () => void }) {
  const { acceptCall, setCallState } = React.useContext(WebRTCContext) as any;

  const onAccept = async () => {
    setCallState("connecting");

    // Get pending offer from window storage
    const pendingOffer = (window as any).__pendingOffer;
    if (pendingOffer) {
      await acceptCall(pendingOffer);
      delete (window as any).__pendingOffer;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 backdrop-blur-2xl text-white">
      <p className="text-2xl mb-4 animate-pulse">Incoming call…</p>
      <div className="flex gap-6 mt-4">
        <button
          onClick={onAccept}
          className="px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 transition"
        >
          Accept
        </button>
        <button
          onClick={() => {
            setCallState("idle");
            onClose?.();
          }}
          className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
