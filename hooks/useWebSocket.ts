"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getServerToken } from "@/lib/getServerToken";

type WSEvent =
  | { type: "message_created"; message: any }
  | { type: "conversation_updated"; conversation: any }
  | { type: "notification"; notification: any }
  | { type: string; [key: string]: any };

export function useWebSocket(
  initialRooms: string[] = [],
  onEvent?: (event: WSEvent) => void
) {
  const { isLoggedIn } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState<string[]>(initialRooms);

  // reconnect timer
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);
  // debounce timer untuk auto-subscribe
  const subscribeTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    let active = true;

    async function connect() {
      try {
        const token = await getServerToken();
        if (!token) return;

        const ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!active) return;
          setConnected(true);
          console.log("✅ WebSocket connected");

          // auto-subscribe dengan debounce
          if (subscribeTimer.current) clearTimeout(subscribeTimer.current);
          subscribeTimer.current = setTimeout(() => {
            rooms.forEach((room) => {
              ws.send(JSON.stringify({ action: "subscribe", room }));
            });
          }, 300); // 300ms debounce
        };

        ws.onmessage = (event) => {
          try {
            const data: WSEvent = JSON.parse(event.data);
            if (onEvent) onEvent(data);
          } catch (err) {
            console.error("❌ Invalid WS message", err);
          }
        };

        ws.onclose = () => {
          if (!active) return;
          setConnected(false);
          console.warn("❌ WebSocket disconnected");
          reconnectRef.current = setTimeout(connect, 3000); // auto reconnect
        };

        ws.onerror = (err) => {
          console.error("❌ WS error", err);
        };
      } catch (err) {
        console.error("❌ WS connection failed", err);
      }
    }

    connect();

    return () => {
      active = false;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (subscribeTimer.current) clearTimeout(subscribeTimer.current);
      wsRef.current?.close();
    };
  }, [isLoggedIn, rooms, onEvent]);

  function send(payload: any) {
    try {
      if (wsRef.current && connected) {
        wsRef.current.send(JSON.stringify(payload));
      }
    } catch (err) {
      console.error("❌ Failed to send WS payload", err);
    }
  }

  function subscribe(room: string) {
    if (rooms.includes(room)) {
      console.log(`⚠️ Already subscribed to ${room}`);
      return;
    }
    setRooms((prev) => [...prev, room]);
    send({ action: "subscribe", room });
  }

  function unsubscribe(room: string) {
    if (!rooms.includes(room)) {
      console.log(`⚠️ Not subscribed to ${room}`);
      return;
    }
    setRooms((prev) => prev.filter((r) => r !== room));
    send({ action: "unsubscribe", room });
  }

  return { connected, send, subscribe, unsubscribe };
}
