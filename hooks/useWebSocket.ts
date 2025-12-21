"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type WSEvent =
  | { type: "message_created"; message: any }
  | { type: "conversation_updated"; conversation: any }
  | { type: "notification"; notification: any }
  | { type: string; [key: string]: any };

type EventListener = (event: WSEvent) => void;

// ✅ ADD: Global event listeners
const eventListeners = new Set<EventListener>();

export function useWebSocket() {
  const { isLoggedIn, loading, forceLogout } = useAuth();

  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const roomsRef = useRef<Set<string>>(new Set());
  const stoppedRef = useRef(false);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

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
      const ws = new WebSocket(`ws://localhost:8080/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!active) return;
        console.log("✅ WebSocket connected");
        setConnected(true);

        // subscribe semua room yang sudah diregistrasi
        roomsRef.current.forEach((room) => {
          ws.send(JSON.stringify({ action: "subscribe", room }));
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
  }, [isLoggedIn, loading, forceLogout]);

  function subscribe(room: string) {
    if (roomsRef.current.has(room)) return;

    roomsRef.current.add(room);

    if (connected && wsRef.current) {
      console.log("📡 Subscribing to room:", room);
      wsRef.current.send(JSON.stringify({ action: "subscribe", room }));
    }
  }

  function unsubscribe(room: string) {
    if (!roomsRef.current.has(room)) return;

    roomsRef.current.delete(room);

    if (connected && wsRef.current) {
      console.log("📡 Unsubscribing from room:", room);
      wsRef.current.send(JSON.stringify({ action: "unsubscribe", room }));
    }
  }

  // ✅ ADD: Methods to add/remove event listeners
  function addEventListener(listener: EventListener) {
    eventListeners.add(listener);
    console.log("🎧 Added event listener, total:", eventListeners.size);
  }

  function removeEventListener(listener: EventListener) {
    eventListeners.delete(listener);
    console.log("🎧 Removed event listener, total:", eventListeners.size);
  }

  return {
    connected,
    subscribe,
    unsubscribe,
    addEventListener,
    removeEventListener,
  };
}
