"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function MentionsPage() {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <Section
        title="Mentions & Replies"
        desc="Alerts related to direct interactions"
      />

      <Toggle label="Notify on @Mentions" />
      <Toggle label="Notify on Direct Replies" />
      <Toggle label="Notify on Quotes" />
      <Toggle label="Highlight Mentioned Messages" />
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
   CYBER MENTION TOGGLE
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
              ? "bg-cyan-500/25 border-cyan-400/40"
              : "bg-white/10 border-white/10"
          }`}
      >
        {/* glow highlight */}
        {active && (
          <motion.div
            className="absolute inset-0 bg-cyan-400/25 blur-md"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          />
        )}

        {/* mention scan */}
        {active && (
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-400/35 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* knob — perfect center */}
        <motion.div
          className={`absolute top-1/2 left-[3px] w-4 h-4 rounded-full -translate-y-1/2 z-10
            ${
              active
                ? "bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                : "bg-gray-400"
            }`}
          animate={{ x: active ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        />
      </button>
    </div>
  );
}
