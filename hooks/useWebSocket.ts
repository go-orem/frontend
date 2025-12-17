"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type WSEvent =
  | { type: "message_created"; message: any }
  | { type: "conversation_updated"; conversation: any }
  | { type: "notification"; notification: any }
  | { type: string; [key: string]: any };

export function useWebSocket(onEvent?: (event: WSEvent) => void) {
  const { isLoggedIn, loading, forceLogout } = useAuth();

  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  // 🧠 state internal (TIDAK trigger re-render)
  const roomsRef = useRef<Set<string>>(new Set());
  const stoppedRef = useRef(false);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  // 🔒 onEvent harus stabil
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    // ⛔ tunggu auth
    if (loading) return;

    // ⛔ logout / auth invalid
    if (!isLoggedIn) {
      stoppedRef.current = true;
      wsRef.current?.close();
      wsRef.current = null;
      setConnected(false);
      return;
    }

    // ⛔ sudah ada WS
    if (wsRef.current || stoppedRef.current) return;

    let active = true;

    async function connect() {
      if (!active || wsRef.current || stoppedRef.current) return;
      const ws = new WebSocket(`ws://localhost:8080/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!active) return;
        setConnected(true);

        // subscribe semua room yang sudah diregistrasi
        roomsRef.current.forEach((room) => {
          ws.send(JSON.stringify({ action: "subscribe", room }));
        });
      };

      ws.onmessage = (e) => {
        try {
          onEventRef.current?.(JSON.parse(e.data));
        } catch {}
      };

      ws.onclose = (e) => {
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

  // =========================
  // PUBLIC API
  // =========================

  function subscribe(room: string) {
    if (roomsRef.current.has(room)) return;

    roomsRef.current.add(room);

    if (connected && wsRef.current) {
      wsRef.current.send(JSON.stringify({ action: "subscribe", room }));
    }
  }

  function unsubscribe(room: string) {
    if (!roomsRef.current.has(room)) return;

    roomsRef.current.delete(room);

    if (connected && wsRef.current) {
      wsRef.current.send(JSON.stringify({ action: "unsubscribe", room }));
    }
  }

  return {
    connected,
    subscribe,
    unsubscribe,
  };
}
