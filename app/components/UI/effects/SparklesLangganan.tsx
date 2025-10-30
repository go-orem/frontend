"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  delay: number;
  rotate: number;
}

interface SparklesProps {
  count?: number;
  areaSize?: number; // ukuran area icon
}

export default function Sparkles({ count = 8, areaSize = 48 }: SparklesProps) {
  const [particles, setParticles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // generate posisi hanya di client
    const generated: Sparkle[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * areaSize,
      y: Math.random() * areaSize,
      size: Math.random() * 6 + 4,
      delay: Math.random(),
      rotate: Math.random() * 360,
    }));
    setParticles(generated);
  }, [count, areaSize]);

  if (!particles.length) return null;

  return (
    <>
      {particles.map((p, idx) => (
        <motion.svg
          key={idx}
          className="absolute pointer-events-none"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            top: `${p.y}px`,
            left: `${p.x}px`,
            rotate: `${p.rotate}deg`,
          }}
          viewBox="0 0 24 24"
          fill="yellow"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            delay: p.delay,
          }}
        >
          <polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" />
        </motion.svg>
      ))}
    </>
  );
}
