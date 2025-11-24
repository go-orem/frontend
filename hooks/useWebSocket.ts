"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type WSMessage = {
  type: string;
  [key: string]: any;
};

export function useWebSocket(roomId?: string) {
  const { isLoggedIn, user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<WSMessage[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Ambil token dari cookie/localStorage atau dari user context
    const token = localStorage.getItem("token"); // atau dari AuthContext jika kamu simpan di sana
    if (!token) return;

    const ws = new WebSocket(
      `ws:${process.env.NEXT_PUBLIC_BASE}/ws?token=${token}`
    );

    ws.onopen = () => {
      setConnected(true);
      console.log("✅ WebSocket connected");

      // Subscribe ke room jika ada
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
        console.error("Invalid WS message", err);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("❌ WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.error("WS error", err);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [isLoggedIn, roomId]);

  // Helper untuk kirim pesan
  function sendMessage(payload: any) {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }

  return { connected, messages, sendMessage };
}
