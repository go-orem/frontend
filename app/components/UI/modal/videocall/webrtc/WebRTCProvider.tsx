// components/webrtc/WebRTCProvider.tsx
"use client";
import React, { createContext, useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";

export const WebRTCContext = createContext<any>(null);

export function WebRTCProvider({ children }: { children: ReactNode }) {
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const peer = useRef<RTCPeerConnection | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [callState, setCallState] = useState<"idle"|"ringing"|"connecting"|"connected"|"ended">("idle");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showPiP, setShowPiP] = useState(false);

  const [useBlur, setUseBlur] = useState(false);
  const [virtualBg, setVirtualBg] = useState<string | null>(null);

  // ---------- local camera ----------
  const startLocal = async (facingMode: "user" | "environment" = "user") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true,
      });
      setLocalStream(stream);
      if (localVideo.current) localVideo.current.srcObject = stream;
    } catch (err) {
      console.error("startLocal error", err);
    }
  };

  // ---------- switch camera ----------
  const switchCamera = async () => {
    if (!localStream) return;
    try {
      const currentTrack = localStream.getVideoTracks()[0];
      const settings = currentTrack.getSettings() as any;
      const currentFacing = settings?.facingMode || "user";
      const newFacing = currentFacing === "user" ? "environment" : "user";

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacing },
        audio: true,
      });
      setLocalStream(newStream);
      if (localVideo.current) localVideo.current.srcObject = newStream;

      const sender = peer.current?.getSenders().find((s) => s.track?.kind === "video");
      if (sender) sender.replaceTrack(newStream.getVideoTracks()[0]);
    } catch (err) {
      console.error("switchCamera error", err);
    }
  };

  // ---------- virtual background / blur toggle ----------
  const toggleBlurBackground = () => {
    setVirtualBg(null);
    setUseBlur((v) => !v);
  };
  const applyVirtualBackground = (url: string) => {
    setUseBlur(false);
    setVirtualBg(url);
  };

  // ---------- screen share ----------
  const startScreenShare = async () => {
    try {
      const sStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
      screenStreamRef.current = sStream;
      const track = sStream.getVideoTracks()[0];
      const sender = peer.current?.getSenders().find((s) => s.track?.kind === "video");
      if (sender && track) sender.replaceTrack(track);
      setIsScreenSharing(true);
      track.onended = () => stopScreenShare();
    } catch (err) {
      console.error("startScreenShare error", err);
    }
  };
  const stopScreenShare = () => {
    const camTrack = localStream?.getVideoTracks()[0];
    const sender = peer.current?.getSenders().find((s) => s.track?.kind === "video");
    if (sender && camTrack) sender.replaceTrack(camTrack);
    setIsScreenSharing(false);
  };

  // ---------- mic / cam toggles: enable/disable tracks ----------
  React.useEffect(() => {
    if (!localStream) return;
    // toggle audio tracks
    try {
      localStream.getAudioTracks().forEach((t) => (t.enabled = micOn));
    } catch (e) {}
    // toggle video tracks
    try {
      localStream.getVideoTracks().forEach((t) => (t.enabled = camOn));
    } catch (e) {}
  }, [micOn, camOn, localStream]);

  // ---------- peer helper ----------
  const createPeer = (iceServers = [{ urls: "stun:stun.l.google.com:19302" }]) => {
    const pc = new RTCPeerConnection({ iceServers });
    pc.ontrack = (e) => {
      setRemoteStream(e.streams[0]);
      if (remoteVideo.current) remoteVideo.current.srcObject = e.streams[0];
    };
    peer.current = pc;
    return pc;
  };

  // ---------- call lifecycle (signaling handled external) ----------
  const startCall = async () => {
    setCallState("connecting");
    const pc = createPeer();
    localStream?.getTracks().forEach((t) => pc.addTrack(t, localStream));
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    // emit offer via socket (external)
    return offer;
  };

  const acceptCall = async (offer: RTCSessionDescriptionInit) => {
    setCallState("connecting");
    const pc = createPeer();
    localStream?.getTracks().forEach((t) => pc.addTrack(t, localStream));
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    // emit answer via socket (external)
    return answer;
  };

  const endCall = () => {
    setCallState("ended");
    peer.current?.close();
    peer.current = null;
    // stop and clear streams
    try { localStream?.getTracks().forEach((t) => t.stop()); } catch (e) {}
    try { remoteStream?.getTracks().forEach((t) => t.stop()); } catch (e) {}
    setLocalStream(null);
    setRemoteStream(null);
  };

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      peer.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WebRTCContext.Provider
      value={{
        // refs
        localVideo,
        remoteVideo,
        canvasRef,
        // actions
        startLocal,
        switchCamera,
        startScreenShare,
        stopScreenShare,
        startCall,
        acceptCall,
        endCall,
        // state
        callState,
        setCallState,
        micOn,
        camOn,
        setMicOn,
        setCamOn,
        isScreenSharing,
        useBlur,
        toggleBlurBackground,
        virtualBg,
        applyVirtualBackground,
        // setters for testing/demo
        setRemoteStream,
        showPiP,
        setShowPiP,
        // streams
        localStream,
        remoteStream,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
}
