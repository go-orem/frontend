// app/providers/WebSocketProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

const WSContext = createContext<ReturnType<typeof useWebSocket> | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const ws = useWebSocket();

  return <WSContext.Provider value={ws}>{children}</WSContext.Provider>;
}

export const useWS = () => {
  const ctx = useContext(WSContext);
  if (!ctx) throw new Error("useWS must be used within WebSocketProvider");
  return ctx;
};
