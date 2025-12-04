"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type WSMessage = {
  type: string;
  [key: string]: any;
};

export function useWebSocket(roomId?: string) {
  const { isLoggedIn } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<WSMessage[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    const ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = () => {
      setConnected(true);
      console.log("✅ WebSocket connected");

      if (roomId) {
        ws.send(
          JSON.stringify({
            action: "subscribe",
            room: `conversation:${roomId}`,
          })
        );
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.log("Invalid WS message", err);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("❌ WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.log("WS error", err);
    };

    wsRef.current = ws;
    return () => ws.close();
  }, [isLoggedIn, roomId]);

  // Helper untuk kirim pesan
  function sendMessage(payload: any) {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }

  return { connected, messages, sendMessage };
}
