"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AnimatedSidebar() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
        color: ["#ff5da2", "#ffd700", "#5da2ff", "#9b5dff", "#ffffff"][
          Math.floor(Math.random() * 5)
        ],
        duration: Math.random() * 3 + 2,
      })),
    []
  );

  return (
    <aside className="relative w-64 h-screen bg-[#202225] overflow-hidden shadow-lg">
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-70"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              filter: "blur(0.5px)",
            }}
            animate={{
              y: [0, -30],
              opacity: [0.8, 0],
              scale: [1, 0.4],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4">
        <div className="relative flex items-center gap-3 p-3 bg-[#2f3136] rounded-xl shadow-lg">
          <img
            src="/avatar.jpg"
            alt="User Avatar"
            className="w-12 h-12 rounded-full border-2 border-pink-500"
          />
          <div className="flex flex-col">
            <span className="text-white font-semibold">Nama User</span>
            <span className="text-gray-400 text-sm">@username</span>
          </div>
          <motion.div
            className="absolute -bottom-2 -right-2 rounded-full p-1 bg-pink-500 border-2 border-[#202225] shadow-lg"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 15, -15, 0],
              boxShadow: [
                "0 0 5px #ff5da2, 0 0 10px #ff5da2",
                "0 0 15px #ff5da2, 0 0 30px #ff5da2",
                "0 0 5px #ff5da2, 0 0 10px #ff5da2",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={14} className="text-white" />
          </motion.div>
        </div>
      </div>
    </aside>
  );
}
