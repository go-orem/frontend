"use client";

import { createContext, useContext, useState, useRef } from "react";

type ModalData = {
  id: number | string;
  anchor: HTMLElement | null;
};

type ModalContextType = {
  openModal: (id: number | string, anchor: HTMLElement | null) => void;
  closeModal: () => void;
  modalData: ModalData | null;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalData, setModalData] = useState<ModalData | null>(null);

  function openModal(id: number | string, anchor: HTMLElement | null) {
    setModalData({ id, anchor });
  }

  function closeModal() {
    setModalData(null);
  }

  return (
    <ModalContext.Provider value={{ modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal harus dipakai dalam ModalProvider");
  return ctx;
}
