"use client";
import React, { createContext, useContext, useState } from "react";
import GiftPanel from "./GiftPanel"; // panel hadiah yang sudah kamu buat

// Bentuk context
const GiftContext = createContext<{
  openGift: boolean;
  setOpenGift: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function GiftProvider({ children }: { children: React.ReactNode }) {
  const [openGift, setOpenGift] = useState(false);

  return (
    <GiftContext.Provider value={{ openGift, setOpenGift }}>
      {children}
      {/* GiftPanel ditaruh di luar children supaya global */}
      <GiftPanel
        open={openGift}
        onClose={() => setOpenGift(false)}
        width="21.2rem"
      />
    </GiftContext.Provider>
  );
}

export function useGift() {
  const ctx = useContext(GiftContext);
  if (!ctx) {
    throw new Error("useGift() harus dipakai di dalam <GiftProvider>");
  }
  return ctx;
}
