// components/webrtc/signaling/socketClient.ts
import { io } from "socket.io-client";

const url = process.env.NEXT_PUBLIC_SIGNALING_URL || "http://localhost:3001";
export const socket = io(url, { transports: ["websocket"] });

export function initSignalingHandlers({
  onOffer,
  onAnswer,
  onIce,
  onRinging,
}: {
  onOffer: (offer: RTCSessionDescriptionInit & { from?: string }) => void;
  onAnswer: (answer: RTCSessionDescriptionInit) => void;
  onIce: (candidate: RTCIceCandidateInit) => void;
  onRinging: (from: string) => void;
}) {
  socket.on("offer", (payload: any) => onOffer(payload));
  socket.on("answer", (payload: any) => onAnswer(payload));
  socket.on("ice-candidate", (payload: any) => onIce(payload.candidate ?? payload));
  socket.on("ringing", (data: any) => onRinging(data?.from ?? data));
}

export function emitOffer(room: string, offer: any) {
  socket.emit("offer", { room, offer });
}
export function emitAnswer(room: string, answer: any) {
  socket.emit("answer", { room, answer });
}
export function emitIce(room: string, candidate: any) {
  socket.emit("ice-candidate", { room, candidate });
}
export function emitRinging(room: string, to: string) {
  socket.emit("ringing", { room, to });
}
