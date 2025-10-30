"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface SparklesProps {
  count?: number; // jumlah sparkles
}

const icons = ["✨", "⭐", "💖", "🎵", "🌸", "🔥", "💬", "😊", "☺️"]; // bebas tambah ikon

export default function SparklesSub({ count = 15 }: SparklesProps) {
  // generate posisi random
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // persentase posisi horizontal
        delay: Math.random() * 2, // delay animasi
        duration: 3 + Math.random() * 2, // durasi naik
        icon: icons[Math.floor(Math.random() * icons.length)],
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-xl"
          style={{ left: `${p.left}%`, bottom: "-10px" }}
          animate={{
            y: ["0%", "-800%"], // naik
            opacity: [0, 1, 0], // muncul lalu hilang
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.icon}
        </motion.div>
      ))}
    </div>
  );
}
