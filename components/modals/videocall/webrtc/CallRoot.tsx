// components/webrtc/CallRoot.tsx
"use client";
import React from "react";
import { WebRTCContext } from "./WebRTCProvider";
import { CallRinging } from "../ui/CallRinging";
import { CallConnecting } from "../ui/CallConnecting";
import { CallConnected } from "../ui/CallConnected";

type CallRootProps = { onClose?: () => void };

export function CallRoot({ onClose }: CallRootProps) {
  const { callState } = React.useContext(WebRTCContext) as any;
  if (callState === "ringing") return <CallRinging onClose={onClose} />;
  if (callState === "connecting") return <CallConnecting onClose={onClose} />;
  if (callState === "connected") return <CallConnected onClose={onClose} />;
  return null;
}

