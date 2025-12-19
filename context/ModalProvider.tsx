"use client";

import React, { createContext, useContext, useState } from "react";

export interface ModalData {
  data?: string; // messageId
  anchor?: HTMLElement;
}

interface ModalContextType {
  modalData: ModalData | null;
  openModal: (data: string, anchor: HTMLElement) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const openModal = (data: string, anchor: HTMLElement) => {
    setModalData({ data, anchor });
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <ModalContext.Provider value={{ modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
}
