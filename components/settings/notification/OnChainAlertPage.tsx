"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function OnChainAlertPage() {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <Section
        title="On-Chain Notifications"
        desc="Blockchain & smart contract events"
      />

      <Toggle label="Message Hash Anchored on Chain" />
      <Toggle label="DAO Proposal Updates" />
      <Toggle label="Token / NFT Activity Alerts" />
      <Toggle label="Smart Contract Event Logs" />

      <div className="pt-4 border-t border-white/10 text-xs text-gray-400">
        On-chain notifications may consume network resources depending on the
        selected blockchain.
      </div>
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
   CYBER ON-CHAIN TOGGLE
   (inline, no component change)
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
        {/* cyber glow */}
        {active && (
          <div className="absolute inset-0 bg-cyan-400/20 blur-md" />
        )}

        {/* on-chain scan line */}
        {active && (
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-400/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* knob — perfectly centered */}
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
