"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SoundVibrationPage() {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <Section
        title="Sound & Vibration"
        desc="Customize notification feedback"
      />

      <Toggle label="Enable Sound" />
      <Toggle label="Vibration" />
      <Toggle label="Silent Mode" />
      <Toggle label="Play Sound for Mentions Only" />
    </div>
  );
}

function Section({ title, desc }: any) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </div>
  );
}

/* =========================
   CYBER SOUND / HAPTIC TOGGLE
========================= */
function Toggle({ label }: any) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-sm">{label}</span>

      <button
        onClick={() => setActive(!active)}
        className={`relative w-11 h-6 rounded-full border overflow-hidden transition-colors duration-300
          ${
            active
              ? "bg-purple-500/25 border-purple-400/40"
              : "bg-white/10 border-white/10"
          }`}
      >
        {/* pulse glow */}
        {active && (
          <motion.div
            className="absolute inset-0 bg-purple-400/25 blur-md"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        {/* sound wave line */}
        {active && (
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-purple-400/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* knob — centered perfectly */}
        <motion.div
          className={`absolute top-1/2 left-[3px] w-4 h-4 rounded-full -translate-y-1/2 z-10
            ${
              active
                ? "bg-purple-400 shadow-[0_0_10px_#c084fc]"
                : "bg-gray-400"
            }`}
          animate={{ x: active ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        />
      </button>
    </div>
  );
}
