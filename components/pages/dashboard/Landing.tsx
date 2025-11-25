"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconChannel,
  IconGroup,
  IconNewChat,
  IconNotifikasi,
  IconProfile,
  IconSetting,
} from "@/components/icons";

const menuItems = [
  {
    title: "Chat",
    desc: "Mulai percakapan dengan temanmu.",
    icon: IconNewChat,
  },
  { title: "Channel", desc: "Ikuti channel favoritmu.", icon: IconChannel },
  { title: "Group", desc: "Gabung dengan komunitas.", icon: IconGroup },
  { title: "Notifikasi", desc: "Lihat update terbaru.", icon: IconNotifikasi },
  { title: "Profile", desc: "Atur akun dan preferensi.", icon: IconProfile },
  {
    title: "Settings",
    desc: "Konfigurasi aplikasi sesuai kebutuhanmu.",
    icon: IconSetting,
  },
];

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.div
      className="p-10 text-white h-full bg-[--background]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-[--primarycolor] mb-2 tracking-tight">
          Selamat Datang di Orem 🚀
        </h1>
        <p className="text-gray-300 text-lg max-w-lg leading-relaxed">
          Komunikasi tanpa batas dengan teman dan komunitas di seluruh dunia.
        </p>
      </motion.div>

      {/* Menu Cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              className="relative rounded-xl p-6 cursor-pointer flex flex-col items-start bg-white/5 backdrop-blur-md 
                         border border-white/10 neon-border-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: mounted ? 0 : idx * 0.08 }}
              whileHover={{
                scale: 1.04,
                rotate: 3,
                boxShadow: "0px 0px 20px rgba(48,213,255,0.6)",
              }}
            >
              {/* Icon Container */}
              <motion.div
                className="mb-4 p-3 rounded-full bg-[--primarycolor]/10 border border-[--primarycolor]/20"
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
              >
                <Icon />
              </motion.div>

              <h2 className="text-xl font-semibold mb-1 tracking-tight">
                {item.title}
              </h2>

              <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
