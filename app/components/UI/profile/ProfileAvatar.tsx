"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

type AvatarProps = {
  src: string;
};

export default function AnimeBadgeAvatar({ src }: AvatarProps) {
  // generate random partikel posisi (lebih banyak)
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 4 + 1.5, // partikel lebih kecil
        delay: Math.random() * 2,
        color: ["#fff", "#ffd700", "#ff5da2", "#5da2ff"][
          Math.floor(Math.random() * 4)
        ],
        duration: Math.random() * 2 + 2, // durasi animasi acak biar variasi
      })),
    []
  );

  return (
    <motion.div
      className="relative inline-block w-18 h-18 -translate-y-4"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Glow ring anime */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-transparent z-0 blur-sm"
        style={{
          background:
            "conic-gradient(from 0deg, #ff5da2, #ffa14d, #ffd700, #5da2ff, #ff5da2)",
          maskImage: "radial-gradient(circle, white 70%, transparent 71%)",
          WebkitMaskImage:
            "radial-gradient(circle, white 70%, transparent 71%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {/* Avatar */}
      <img
        src={src}
        alt="User Avatar"
        className="w-18 h-18 rounded-full object-cover border-3 border-[#202225] relative shadow-xl"
      />

      {/* Badge Star (Nitro style) */}
      <motion.div
        className="absolute -bottom-2 -left-2 w-10 h-auto rounded-full p-1.5 z-20"
        animate={{
          y: [0, -3, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <img
          src="https://cuandigitalkit.com/wp-content/uploads/2025/09/ChatGPT-Image-Aug-25-2025-03_02_12-PM-2.png"
          alt=""
        />
      </motion.div>

      {/* Partikel efek anime */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-80"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              filter: "blur(0.5px)",
            }}
            animate={{
              y: [0, -40], // lebih tinggi
              opacity: [0.9, 0],
              scale: [1, 0.3],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
