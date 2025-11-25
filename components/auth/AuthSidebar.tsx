"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import SparklesSub from "../../app/components/UI/effects/SparklesSub";
import Web3LoginButton from "./Web3LoginButton";
import GoogleLoginButton from "./GoogleLoginButton";
import { IconApple } from "../icons";

type TabItem = {
  name: string;
  price?: string;
  iconUrl: string;
  items?: string[];
  type?: "login" | "register" | "guest" | "info";
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

export default function AuthSidebar({ open, onClose }: SidebarProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const tabs: TabItem[] = [
    {
      name: "Masuk",
      iconUrl:
        "https://cuandigitalkit.com/wp-content/uploads/2025/09/subcribe.png",
      type: "login",
    },
    {
      name: "More Wallet",
      iconUrl:
        "https://cuandigitalkit.com/wp-content/uploads/2025/09/subcribe.png",
      type: "register",
    },
    {
      name: "Masuk Tamu",
      iconUrl:
        "https://cuandigitalkit.com/wp-content/uploads/2025/09/subcribe.png",
      type: "guest",
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
            className="fixed left-0 top-0 h-full w-xl bg-custom-radial z-50 font-mono text-sm text-white flex"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* TAB BUTTONS */}
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

            {/* CONTENT */}
            <div className="flex-1 p-4 overflow-auto border-r border-gray-700">
              <motion.h2
                className="text-lg font-mono font-bold mb-4"
                key={tabs[activeTab]?.name || "Tab"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                {tabs[activeTab]?.name}
              </motion.h2>

              {/* Konten sesuai tab */}
              {tabs[activeTab].type === "login" && (
                <form className="space-y-3">
                  <div>
                    <p>Login and create wallet</p>
                  </div>

                  {/* Button */}
                  <div className="mt-14 relative space-y-3">
                    {/* web3 */}
                    <Web3LoginButton />

                    {/* google */}
                    <GoogleLoginButton />

                    <button className="relative z-10 w-full px-6 py-2.5 rounded-full font-mono text-sm font-bold bg-(--background) text-white neon-border cursor-pointer">
                      <div className="flex items-center gap-3">
                        <IconApple />
                        <span>Apple</span>
                      </div>
                    </button>
                    <button className="relative z-10 w-full px-6 py-2.5 rounded-full font-mono text-sm font-bold bg-(--background) text-white neon-border cursor-pointer">
                      <div className="flex items-center gap-3">
                        <img
                          className="w-6 h-auto"
                          src="https://coinlaunch.space/media/images/4/8/5/0/4850.sp3ow1.192x192.png"
                          alt=""
                        />
                        <span>Phantom</span>
                      </div>
                    </button>
                  </div>
                </form>
              )}

              {tabs[activeTab].type === "register" && (
                <form className="space-y-3">
                  <div>
                    <p className="text-gray-300">
                      Kami tidak menyimpan dana anda ataupun private key, dan
                      kami bertindak sebagai non custodial semua wallet dan dana
                      anda yang pegang di wallet dompet anda
                    </p>
                  </div>
                  <div className="mt-7 relative">
                    <button className="relative z-10 w-full px-6 py-2.5 rounded-full font-mono text-sm font-bold bg-(--background) text-white neon-border cursor-pointer">
                      <div className="flex items-center gap-3">
                        <img
                          className="w-6 h-auto"
                          src="https://coinlaunch.space/media/images/4/8/5/0/4850.sp3ow1.192x192.png"
                          alt=""
                        />
                        <span>Phantom</span>
                      </div>
                    </button>
                  </div>
                </form>
              )}

              {tabs[activeTab].type === "guest" && (
                <div className="space-y-3">
                  <p className="text-gray-300">
                    Login sebagai tamu untuk mencoba aplikasi tanpa membuat akun
                  </p>
                  <div className="mt-14 relative">
                    <button className="relative z-10 w-full px-4 py-2.5 rounded-full font-mono text-sm font-bold bg-(--background) text-white neon-border cursor-pointer">
                      Masuk Sebagai Tamu
                    </button>
                    <SparklesSub count={10} />
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
