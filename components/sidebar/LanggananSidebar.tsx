"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesSub } from "../UI";

type TabItem = {
  name: string;
  price: string;
  iconUrl: string;
  items: string[];
};

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

// Sparkles kecil yang bergerak
function Sparkles({ count = 5 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 16 - 8,
      y: Math.random() * 16 + 8,
      size: Math.random() * 4 + 2,
      delay: Math.random(),
    }));
  }, [count]);

  return (
    <>
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute bg-linear-to-b from-(--primarycolor) to-yellow-400"
          style={{ width: p.size, height: p.size }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-p.y, -p.y - 30, -p.y - 40],
            x: [0, p.x, p.x / 2],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.2,
            delay: p.delay,
          }}
        />
      ))}
    </>
  );
}

export default function LanggananSidebar({ open, onClose }: SidebarProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const tabs: TabItem[] = [
    {
      name: "Mulai",
      price: "$3/",
      iconUrl:
        "https://cuandigitalkit.com/wp-content/uploads/2025/09/subcribe.png",

      items: [
        "🔥 Login Device",
        "🦋 2FA",
        "✅ Session",
        "🎁 Bonus",
        "🚀 Unlimited",
      ],
    },
    {
      name: "Mulai Aja",
      price: "$10/",
      iconUrl:
        "https://cuandigitalkit.com/wp-content/uploads/2025/09/subcribe.png",
      items: ["Video call", "Unlimited audio call"],
    },
    {
      name: "Mulai Gass",
      price: "$30/",
      iconUrl:
        "https://cuandigitalkit.com/wp-content/uploads/2025/09/subcribe.png",
      items: [
        "Nama token",
        "Deskripsi",
        "Total supply",
        "Smart contract copy",
        "Harga saat ini",
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<HTMLButtonElement[]>([]);
  const [pill, setPill] = useState({ top: 0, height: 0 });

  const setTabRef = (el: HTMLButtonElement | null, idx: number) => {
    if (el) tabRefs.current[idx] = el;
  };

  const updatePill = () => {
    const el = tabRefs.current[activeTab];
    if (el && el.parentElement) {
      const rect = el.getBoundingClientRect();
      const parentRect = el.parentElement.getBoundingClientRect();
      setPill({ top: rect.top - parentRect.top, height: rect.height });
    }
  };

  useLayoutEffect(() => {
    updatePill();
    const id = window.setTimeout(updatePill, 50);
    return () => window.clearTimeout(id);
  }, [activeTab, open]);

  useEffect(() => {
    const onResize = () => updatePill();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            onClick={onClose}
            className="fixed inset-0 w-full h-screen z-40 bg-black/50 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            className="fixed left-0 top-0 h-full w-xl bg-custom-radial z-50  text-sm text-white flex"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="relative w-max bg-(--background) border-r border-gray-700">
              <div className="flex flex-col p-2 space-y-1 relative z-10">
                {tabs.map((tab, idx) => (
                  <button
                    key={tab.name}
                    ref={(el) => setTabRef(el, idx)}
                    onClick={() => setActiveTab(idx)}
                    className={`relative text-left p-2 rounded transition-colors flex items-center gap-2 cursor-pointer ${
                      activeTab === idx
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    type="button"
                  >
                    <div className="relative w-12 h-12">
                      <img
                        src={tab.iconUrl}
                        alt={tab.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                      {activeTab === idx && <Sparkles count={15} />}
                    </div>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto border-r border-gray-700">
              <motion.h2
                className="text-lg  font-bold mb-4"
                key={tabs[activeTab]?.name || "Tab"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex justify-between items-end">
                  {tabs[activeTab]?.name || ""}
                  {tabs[activeTab]?.price && (
                    <div className="text-2xl font-bold text-(--primarycolor)">
                      <div>
                        {tabs[activeTab].price}
                        <span className="text-xs">Bulan</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-light text-gray-300">
                          Dibayar per tahun
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.h2>

              <div className="space-y-3">
                {tabs[activeTab]?.items?.map((item, idx) => (
                  <motion.div
                    key={item}
                    className="p-3 rounded bg-(--hovercolor) hover:animate-pulse transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + idx * 0.06 }}
                  >
                    {item}
                  </motion.div>
                )) || null}
              </div>
              <div className="mt-14 relative">
                {/* Button */}
                <button className="relative z-10 w-full px-4 py-2.5 rounded-full  text-sm font-bold bg-(--background) text-white neon-border cursor-pointer">
                  Gas Berlangganan
                </button>
                <SparklesSub count={10} />

                <motion.div
                  className="absolute -top-10.5 w-17 h-auto z-0 pointer-events-none"
                  animate={{
                    y: [0, -3, 0],
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  whileHover={{ opacity: 0 }} // ngilang saat hover
                >
                  <img
                    src="https://cuandigitalkit.com/wp-content/uploads/2025/09/ChatGPT-Image-Aug-25-2025-03_02_12-PM-2.png"
                    alt="Sparkles"
                    className="w-full h-auto"
                  />
                </motion.div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-light  text-gray-400">
                  <span className="font-bold text-sm text-white">
                    Penting:{" "}
                  </span>
                  Pembayaran bisa kamu pilih tersedia untuk crypto, langsung
                  dari wallet kamu atau menggunakan payment gateway
                </p>
              </div>

              <motion.div
                className="absolute w-100 h-auto -bottom-20 -right-40 rounded-full p-1.5"
                animate={{
                  y: [0, -3, 0, -4, 0, -3, 0], // naik-turun variatif
                  x: [0, 2, -10, 1, 0, 0], // gerakan horizontal halus
                  scale: [1, 1, 1], // variasi scale
                  rotate: [0, 6, -6, 4, -4, 0], // rotasi ringan
                }}
                transition={{
                  duration: 4, // lebih smooth
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <SparklesSub count={30} />
                <img
                  src="https://cuandigitalkit.com/wp-content/uploads/2025/09/Gemini_Generated_Image_p0c5mdp0c5mdp0c5-2.png"
                  alt="Floating"
                />
              </motion.div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
