"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type AvatarProps = {
  src: string;
};

export default function AnimeBadgeAvatar({ src }: AvatarProps) {
  const [particles, setParticles] = useState<
    {
      left: number;
      top: number;
      size: number;
      delay: number;
      color: string;
      duration: number;
    }[]
  >([]);

  // Generate particles only on client
  useEffect(() => {
    const colors = ["#ffffffaa", "#ffd700dd", "#ff5da2cc", "#5da2ffdd"];

    const temp = Array.from({ length: 35 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1.2, // lebih halus
      delay: Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 1.5 + 1.8,
    }));

    setParticles(temp);
  }, []);

  return (
    <motion.div
      className="relative inline-block w-[70px] h-[70px]"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 15 }}
    >
      {/* Glow ring (premium anime style) */}
      <motion.div
        className="absolute inset-0 rounded-full blur-md z-0"
        style={{
          background:
            "conic-gradient(from 0deg, #ff5da2, #ffa14d, #ffd700, #5da2ff, #ff5da2)",
          maskImage: "radial-gradient(circle, white 68%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle, white 68%, transparent 70%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {/* Avatar */}
      <img
        src={src}
        alt="Avatar"
        className="w-full h-full rounded-full object-cover border-[3px] border-[#1a1b1f] relative shadow-lg"
      />

      {/* Nitro Badge (clean) */}
      <motion.div
        className="absolute bottom-1 -right-1 w-[26px] h-[26px] rounded-full flex items-center justify-center shadow-md"
        animate={{
          y: [0, -2, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <img
          src="https://cuandigitalkit.com/wp-content/uploads/2025/09/ChatGPT-Image-Aug-25-2025-03_02_12-PM-2.png"
          alt="badge"
          className="w-[18px] h-[18px]"
        />
      </motion.div>

      {/* Soft particles (anime float) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -25],
              opacity: [1, 0],
              scale: [1, 0.4],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
