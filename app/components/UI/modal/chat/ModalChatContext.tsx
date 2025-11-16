"use client";
import React, { createContext, useContext, useState } from "react";

// Bentuk context
const ModalChatContext = createContext<{
  openModalChat: boolean;
  setOpenModalChat: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function ModalChatProvider({ children }: { children: React.ReactNode }) {
  const [openModalChat, setOpenModalChat] = useState(false);

  return (
    <ModalChatContext.Provider value={{ openModalChat, setOpenModalChat }}>
      {children}
    </ModalChatContext.Provider>
  );
}

export function useModalChat() {
  const ctx = useContext(ModalChatContext);
  if (!ctx) {
    throw new Error("useModalChat() harus dipakai di dalam <ModalChatProvider>");
  }
  return ctx;
}
