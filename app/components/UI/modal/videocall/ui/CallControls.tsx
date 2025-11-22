// components/webrtc/ui/CallControls.tsx
"use client";
import React, { useState } from "react";
import { Mic, MicOff, Camera, CameraOff, Monitor, PhoneOff, Image as ImageIcon, Sparkles } from "lucide-react";
import { WebRTCContext } from "../webrtc/WebRTCProvider";

export function CallControls() {
  const {
    micOn,
    camOn,
    setMicOn,
    setCamOn,
    switchCamera,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    toggleBlurBackground,
    applyVirtualBackground,
    endCall,
  } = React.useContext(WebRTCContext) as any;

  const { showPiP, setShowPiP } = React.useContext(WebRTCContext) as any;

  const [switching, setSwitching] = useState(false);
  const onSwitchCamera = async () => {
    setSwitching(true);
    await switchCamera();
    // quick transition
    setTimeout(() => setSwitching(false), 450);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 items-center z-99">
      <button onClick={() => setMicOn(!micOn)} className="p-3 rounded-full bg-white/10">
        {micOn ? <Mic /> : <MicOff />}
      </button>

      <button onClick={() => setCamOn(!camOn)} className="p-3 rounded-full bg-white/10">
        {camOn ? <Camera /> : <CameraOff />}
      </button>

      <button onClick={onSwitchCamera} className={`p-3 rounded-full bg-white/10 transition-transform ${switching ? "scale-95" : ""}`}>
        🔄
      </button>

      <button onClick={toggleBlurBackground} className="p-3 rounded-full bg-white/10 flex items-center gap-1">
        <Sparkles size={16} />
      </button>

      <button onClick={() => applyVirtualBackground("/mnt/data/Screenshot 2025-11-21 at 07.44.47.png")} className="p-3 rounded-full bg-white/10">
        <ImageIcon />
      </button>

      <button onClick={isScreenSharing ? stopScreenShare : startScreenShare} className="p-3 rounded-full bg-white/10">
        <Monitor />
      </button>

      <button onClick={() => setShowPiP(!showPiP)} className={`p-3 rounded-full bg-white/10 ${showPiP ? "ring-2 ring-white/20" : ""}`}>
        PiP
      </button>

      <button onClick={endCall} className="p-3 rounded-full bg-red-600 text-white shadow-lg">
        <PhoneOff />
      </button>
    </div>
  );
}
