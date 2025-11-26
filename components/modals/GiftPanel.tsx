"use client";
import React, { useEffect, useState } from "react";
import { TabGroup, TabList, Tab, TabPanel, TabPanels } from "@headlessui/react";

type GiftPanelProps = {
  open: boolean;
  onClose: () => void;
  width?: string;
  offsetRight?: string;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function GiftPanel({
  open,
  onClose,
  width = "21.2rem",
  offsetRight = "0",
}: GiftPanelProps) {
  // disable scroll body saat panel terbuka
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // tutup dengan Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // kategori hadiah
  const giftCategories: Record<string, string[]> = {
    Event: Array.from({ length: 8 }, (_, i) => `Populer ${i + 1}`),
    Lucky: Array.from({ length: 8 }, (_, i) => `Premium ${i + 1}`),
    Fun: Array.from({ length: 8 }, (_, i) => `Spesial ${i + 1}`),
    Utility: Array.from({ length: 8 }, (_, i) => `Spesial ${i + 1}`),
  };

  const categoryNames = Object.keys(giftCategories);

  // state tab aktif
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        style={{ right: offsetRight, width }}
        className={`fixed bottom-0 z-50 h-auto transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } bg-(--background)/70 backdrop-blur-lg border-l border-(--primarycolor)/60 shadow-lg rounded-2xl`}
      >
        <div className="flex items-center justify-between p-4">
          <h3 className="text-sm font-black font-mono text-white">
            Kirim Hadiah 🎁 💐
          </h3>
          <button
            onClick={onClose}
            aria-label="Tutup panel hadiah"
            className="rounded-full p-2 text-gray-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-auto text-gray-200">
          <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex}>
            {/* TabList dengan pill bergerak */}
            <TabList className="relative flex overflow-x-auto space-x-6 pb-3">
              {categoryNames.map((name, idx) => (
                <Tab
                  key={idx}
                  className="group relative flex flex-col items-center justify-center pb-1 cursor-pointer"
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`font-mono text-sm transition-colors ${
                          selected
                            ? "text-[--primarycolor]"
                            : "text-gray-400 group-hover:text-[--primarycolor]"
                        }`}
                      >
                        {name}
                      </span>
                      <span
                        className={`absolute -bottom-1 h-1 rounded-full bg-[--primarycolor] transition-all duration-300 ease-in-out ${
                          selected
                            ? "w-10 opacity-100"
                            : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
                        }`}
                      />
                    </>
                  )}
                </Tab>
              ))}
            </TabList>

            {/* konten tiap tab */}
            <TabPanels className="mt-4">
              {categoryNames.map((name, idx) => (
                <TabPanel
                  key={idx}
                  className="grid grid-cols-4 gap-3 focus:outline-none"
                >
                  {giftCategories[name].map((item) => (
                    <button
                      key={item}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-gray-700"
                      onClick={() => console.log("Pilih hadiah", item)}
                    >
                      <div className="w-12 h-12 rounded-md flex items-center justify-center">
                        <img src="https://cuandigitalkit.com/wp-content/uploads/2025/09/subcribe.png" alt="" />
                      </div>
                      <span className="text-xs font-mono">{item}</span>
                    </button>
                  ))}
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          <div className="mt-6">
            <button className="w-full px-4 py-2 rounded-full font-mono text-sm font-bold text-white transition-colors ease-in-out neon-border cursor-pointer">
              Kirim
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}