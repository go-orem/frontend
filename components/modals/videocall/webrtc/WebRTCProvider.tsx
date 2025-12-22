// components/webrtc/WebRTCProvider.tsx
"use client";
import React, {
  createContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useWS } from "@/context/WebsocketProvider";

export const WebRTCContext = createContext<any>(null);

interface WebRTCProviderProps {
  children: ReactNode;
  conversationId?: string; // Room untuk signaling
}

export function WebRTCProvider({
  children,
  conversationId,
}: WebRTCProviderProps) {
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const peer = useRef<RTCPeerConnection | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [callState, setCallState] = useState<
    "idle" | "ringing" | "connecting" | "connected" | "ended"
  >("idle");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showPiP, setShowPiP] = useState(false);

  const [useBlur, setUseBlur] = useState(false);
  const [virtualBg, setVirtualBg] = useState<string | null>(null);

  // WebSocket integration
  const ws = useWS();
  const room = conversationId ? `conversation:${conversationId}` : "";

  // ---------- local camera ----------
  const startLocal = async (facingMode: "user" | "environment" = "user") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true,
      });
      setLocalStream(stream);
      if (localVideo.current) localVideo.current.srcObject = stream;
      console.log("✅ Local stream started");
    } catch (err) {
      console.error("❌ startLocal error:", err);
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

      // Stop old tracks
      localStream.getTracks().forEach((t) => t.stop());

      setLocalStream(newStream);
      if (localVideo.current) localVideo.current.srcObject = newStream;

      const sender = peer.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");
      if (sender) sender.replaceTrack(newStream.getVideoTracks()[0]);

      console.log("✅ Camera switched to:", newFacing);
    } catch (err) {
      console.error("❌ switchCamera error:", err);
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
      const sStream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });
      screenStreamRef.current = sStream;
      const track = sStream.getVideoTracks()[0];
      const sender = peer.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");
      if (sender && track) sender.replaceTrack(track);
      setIsScreenSharing(true);
      track.onended = () => stopScreenShare();
      console.log("✅ Screen sharing started");
    } catch (err) {
      console.error("❌ startScreenShare error:", err);
    }
  };

  const stopScreenShare = () => {
    const camTrack = localStream?.getVideoTracks()[0];
    const sender = peer.current
      ?.getSenders()
      .find((s) => s.track?.kind === "video");
    if (sender && camTrack) sender.replaceTrack(camTrack);
    setIsScreenSharing(false);
    console.log("✅ Screen sharing stopped");
  };

  // ---------- mic / cam toggles: enable/disable tracks ----------
  useEffect(() => {
    if (!localStream) return;
    try {
      localStream.getAudioTracks().forEach((t) => (t.enabled = micOn));
    } catch (e) {}
    try {
      localStream.getVideoTracks().forEach((t) => (t.enabled = camOn));
    } catch (e) {}
  }, [micOn, camOn, localStream]);

  // ---------- peer helper ----------
  const createPeer = useCallback(() => {
    const iceServers = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ];

    const pc = new RTCPeerConnection({ iceServers });

    // Handle incoming tracks
    pc.ontrack = (e) => {
      console.log("✅ Remote track received:", e.streams[0]);
      setRemoteStream(e.streams[0]);
      if (remoteVideo.current) remoteVideo.current.srcObject = e.streams[0];
    };

    // Handle ICE candidates
    pc.onicecandidate = (e) => {
      if (e.candidate && room) {
        console.log("🧊 Sending ICE candidate");
        ws.sendMessage({
          action: "call_ice_candidate",
          room,
          data: e.candidate.toJSON(),
        });
      }
    };

    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", pc.connectionState);
      if (pc.connectionState === "connected") {
        setCallState("connected");
      } else if (
        pc.connectionState === "failed" ||
        pc.connectionState === "disconnected"
      ) {
        setCallState("ended");
      }
    };

    peer.current = pc;
    return pc;
  }, [room, ws]);

  // ---------- WebRTC signaling methods ----------
  const startCall = async () => {
    if (!localStream || !room) {
      console.error("❌ Cannot start call: no local stream or room");
      return;
    }

    console.log("📞 Starting call...");
    setCallState("connecting");

    const pc = createPeer();
    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer via WebSocket
      ws.sendMessage({
        action: "call_offer",
        room,
        data: offer,
      });

      // Notify ringing
      ws.sendMessage({
        action: "call_ringing",
        room,
      });

      console.log("✅ Call offer sent");
    } catch (err) {
      console.error("❌ startCall error:", err);
      setCallState("ended");
    }
  };

  const acceptCall = async (offer: RTCSessionDescriptionInit) => {
    if (!localStream || !room) {
      console.error("❌ Cannot accept call: no local stream or room");
      return;
    }

    console.log("📞 Accepting call...");
    setCallState("connecting");

    const pc = createPeer();
    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Process queued ICE candidates
      while (iceCandidatesQueue.current.length > 0) {
        const candidate = iceCandidatesQueue.current.shift();
        if (candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer via WebSocket
      ws.sendMessage({
        action: "call_answer",
        room,
        data: answer,
      });

      // Notify joined
      ws.sendMessage({
        action: "call_joined",
        room,
      });

      console.log("✅ Call answer sent");
    } catch (err) {
      console.error("❌ acceptCall error:", err);
      setCallState("ended");
    }
  };

  const endCall = () => {
    console.log("📞 Ending call...");

    setCallState("ended");

    // Notify other participants
    if (room) {
      ws.sendMessage({
        action: "call_end",
        room,
      });
    }

    // Close peer connection
    peer.current?.close();
    peer.current = null;

    // Stop and clear streams
    try {
      localStream?.getTracks().forEach((t) => t.stop());
    } catch (e) {}
    try {
      remoteStream?.getTracks().forEach((t) => t.stop());
    } catch (e) {}

    setLocalStream(null);
    setRemoteStream(null);

    console.log("✅ Call ended");
  };

  // ---------- WebSocket event handlers ----------
  useEffect(() => {
    if (!ws.connected || !room) return;

    const handleWebRTCEvent = async (event: any) => {
      switch (event.type) {
        case "call_offer":
          console.log("📨 Received call offer from:", event.from);
          if (callState === "idle") {
            setCallState("ringing");
            // Store offer for later acceptance
            (window as any).__pendingOffer = event.data;
          }
          break;

        case "call_answer":
          console.log("📨 Received call answer from:", event.from);
          if (peer.current && event.data) {
            try {
              await peer.current.setRemoteDescription(
                new RTCSessionDescription(event.data)
              );

              // Process queued ICE candidates
              while (iceCandidatesQueue.current.length > 0) {
                const candidate = iceCandidatesQueue.current.shift();
                if (candidate) {
                  await peer.current.addIceCandidate(
                    new RTCIceCandidate(candidate)
                  );
                }
              }
            } catch (err) {
              console.error("❌ Error setting remote description:", err);
            }
          }
          break;

        case "call_ice_candidate":
          console.log("📨 Received ICE candidate from:", event.from);
          if (event.data) {
            try {
              if (peer.current && peer.current.remoteDescription) {
                await peer.current.addIceCandidate(
                  new RTCIceCandidate(event.data)
                );
              } else {
                // Queue ICE candidates if remote description not set yet
                iceCandidatesQueue.current.push(event.data);
              }
            } catch (err) {
              console.error("❌ Error adding ICE candidate:", err);
            }
          }
          break;

        case "call_ringing":
          console.log("📨 Call ringing from:", event.from);
          // Handle ringing notification (UI update)
          break;

        case "call_joined":
          console.log("📨 User joined call:", event.from);
          // Handle participant joined
          break;

        case "call_left":
          console.log("📨 User left call:", event.from);
          // Handle participant left
          break;

        case "call_end":
          console.log("📨 Call ended by:", event.from);
          endCall();
          break;
      }
    };

    ws.addEventListener(handleWebRTCEvent);

    return () => {
      ws.removeEventListener(handleWebRTCEvent);
    };
  }, [ws, room, callState, endCall]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      peer.current?.close();
    };
  }, [localStream]);

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
        // WebSocket
        room,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
}
