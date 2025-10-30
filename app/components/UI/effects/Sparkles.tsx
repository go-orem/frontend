// components/UI/effects/Sparkles.tsx
"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function Sparkles({ count = 20 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        width: Math.random() * 6 + 4,
        height: Math.random() * 12 + 8,
        delay: Math.random() * 3,
        rotate: Math.random() * 360,
        color:
          ["#ffffff", "#00ff7f", "#5da2ff", "#ffd700"][
            Math.floor(Math.random() * 4)
          ], // warna random
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            opacity: 0.5,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", // bentuk daun/ranting
            transform: `rotate(${p.rotate}deg)`,
          }}
          animate={{
            y: [0, -50 - Math.random() * 20], // melayang ke atas
            x: [0, (Math.random() - 0.5) * 20], // gerakan sedikit horizontal
            opacity: [0.5, 0],
            rotate: [p.rotate, p.rotate + (Math.random() * 60 - 30)],
            scale: [1, 0.6],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
