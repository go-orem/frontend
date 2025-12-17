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

  useEffect(() => {
    if (!isLoggedIn) return;

    let active = true;

    async function connect() {
      const token = await getServerToken();
      if (!token) return;

      const ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!active) return;
        setConnected(true);
        console.log("✅ WebSocket connected");

        // subscribe ke semua room yang sudah ada
        rooms.forEach((room) => {
          ws.send(JSON.stringify({ action: "subscribe", room }));
        });
      };

      ws.onmessage = (event) => {
        try {
          const data: WSEvent = JSON.parse(event.data);
          if (onEvent) onEvent(data); // kirim ke provider
        } catch (err) {
          console.error("Invalid WS message", err);
        }
      };

      ws.onclose = () => {
        if (!active) return;
        setConnected(false);
        console.log("❌ WebSocket disconnected");
        // auto reconnect
        reconnectRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error("WS error", err);
      };
    }

    connect();

    return () => {
      active = false;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [isLoggedIn, rooms]);

  function send(payload: any) {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }

  function subscribe(room: string) {
    if (!rooms.includes(room)) {
      setRooms((prev) => [...prev, room]);
    }
    send({ action: "subscribe", room });
  }

  function unsubscribe(room: string) {
    setRooms((prev) => prev.filter((r) => r !== room));
    send({ action: "unsubscribe", room });
  }

  function handleEvent(event: WSEvent) {
    switch (event.type) {
      case "message_created":
        // TODO: dispatch ke ConversationContext
        console.log("📩 New message", event.message);
        break;
      case "conversation_updated":
        console.log("🔄 Conversation updated", event.conversation);
        break;
      case "notification":
        console.log("🔔 Notification", event.notification);
        break;
      default:
        console.log("Unknown event", event);
    }
  }

  return { connected, send, subscribe, unsubscribe };
}
