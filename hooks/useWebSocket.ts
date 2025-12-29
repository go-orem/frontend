"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getClientToken } from "@/lib/getClientToken";

type WSEvent =
  | { type: "message_created"; message: any }
  | { type: "conversation_updated"; conversation: any }
  | { type: "notification"; notification: any }
  | {
      type: "call_offer";
      from: string;
      data: any;
      room: string;
      target?: string;
    }
  | {
      type: "call_answer";
      from: string;
      data: any;
      room: string;
      target?: string;
    }
  | {
      type: "call_ice_candidate";
      from: string;
      data: any;
      room: string;
      target?: string;
    }
  | { type: "call_ringing"; from: string; room: string; target?: string }
  | { type: "call_joined"; from: string; room: string }
  | { type: "call_left"; from: string; room: string }
  | { type: "call_end"; from: string; room: string }
  | { type: string; [key: string]: any };

type EventListener = (event: WSEvent) => void;

// ✅ Global event listeners
const eventListeners = new Set<EventListener>();

export function useWebSocket() {
  const { isLoggedIn, loading, forceLogout } = useAuth();

  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const roomsRef = useRef<Set<string>>(new Set());
  const stoppedRef = useRef(false);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  const WS_URL =
    process.env.NEXT_PUBLIC_WEBSOCKET_BASE || "ws://localhost:8080/ws";

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      stoppedRef.current = true;
      wsRef.current?.close();
      wsRef.current = null;
      setConnected(false);
      return;
    }

    if (wsRef.current || stoppedRef.current) return;

    let active = true;

    async function connect() {
      if (!active || wsRef.current || stoppedRef.current) return;

      // ✅ Get token from cookie
      const token = getClientToken();

      // ✅ Add token to WebSocket URL
      const wsUrl = token
        ? `${WS_URL}?token=${encodeURIComponent(token)}`
        : WS_URL;

      console.log("🔌 Connecting WebSocket...", { hasToken: !!token });
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!active) return;
        console.log("✅ WebSocket connected");
        setConnected(true);

        // subscribe semua room yang sudah diregistrasi
        roomsRef.current.forEach((room) => {
          // ✅ FIX: Check readyState before sending
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: "subscribe", room }));
          }
        });
      };

      ws.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log("📨 WS Event received:", event.type);

          // ✅ Broadcast to all listeners
          eventListeners.forEach((listener) => {
            try {
              listener(event);
            } catch (err) {
              console.error("❌ Event listener error:", err);
            }
          });
        } catch (err) {
          console.error("❌ Failed to parse WS message:", err);
        }
      };

      ws.onclose = (e) => {
        console.log("WebSocket closed:", e.code);
        setConnected(false);
        wsRef.current = null;

        // auth error → STOP
        if (e.code === 1008 || e.code === 4001) {
          stoppedRef.current = true;
          forceLogout("WebSocket auth failed");
          return;
        }

        reconnectRef.current = setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      active = false;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [isLoggedIn, loading, forceLogout, WS_URL]);

  function subscribe(room: string) {
    if (roomsRef.current.has(room)) return;

    roomsRef.current.add(room);

    // ✅ FIX: Check both connected AND readyState
    if (
      connected &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      console.log("📡 Subscribing to room:", room);
      wsRef.current.send(JSON.stringify({ action: "subscribe", room }));
    } else {
      console.log(
        "📡 Queued subscription for room:",
        room,
        "- will subscribe when connected"
      );
    }
  }

  function unsubscribe(room: string) {
    if (!roomsRef.current.has(room)) return;

    roomsRef.current.delete(room);

    // ✅ FIX: Check both connected AND readyState
    if (
      connected &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      console.log("📡 Unsubscribing from room:", room);
      wsRef.current.send(JSON.stringify({ action: "unsubscribe", room }));
    }
  }

  // ✅ Methods to add/remove event listeners
  function addEventListener(listener: EventListener) {
    eventListeners.add(listener);
    console.log("🎧 Added event listener, total:", eventListeners.size);
  }

  function removeEventListener(listener: EventListener) {
    eventListeners.delete(listener);
    console.log("🎧 Removed event listener, total:", eventListeners.size);
  }

  // ✅ NEW: Send raw message to WebSocket (for WebRTC signaling)
  function sendMessage(message: any) {
    // ✅ FIX: Check readyState before sending
    if (
      !connected ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      console.warn("⚠️ WebSocket not connected, cannot send message");
      return false;
    }

    try {
      wsRef.current.send(JSON.stringify(message));
      return true;
    } catch (err) {
      console.error("❌ Failed to send WebSocket message:", err);
      return false;
    }
  }

  return {
    connected,
    subscribe,
    unsubscribe,
    addEventListener,
    removeEventListener,
    sendMessage,
  };
}
