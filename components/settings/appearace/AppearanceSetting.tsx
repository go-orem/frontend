"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AppearanceSetting({ onClose }: any) {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");

  return (
    <aside className="relative h-full bg-[--background] text-gray-200 flex flex-col">
      {/* HEADER */}
      <div className="p-4 pt-2.5 flex items-center justify-between">
        <h2 className="text-md font-semibold">Appearance</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-black/40 hover:bg-(--hovercolor)"
        >
          <X size={18} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {/* THEME MODE */}
        <Section title="Theme Mode" desc="Choose how OREMChat looks">
          <div className="grid grid-cols-3 gap-3">
            <ThemeCard
              label="Dark"
              active={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              <DarkIcon />
            </ThemeCard>

            <ThemeCard
              label="Light"
              active={theme === "light"}
              onClick={() => setTheme("light")}
            >
              <LightIcon />
            </ThemeCard>

            <ThemeCard
              label="System"
              active={theme === "system"}
              onClick={() => setTheme("system")}
            >
              <SystemIcon />
            </ThemeCard>
          </div>
        </Section>

        {/* ACCENT COLOR */}
        <Section title="Accent Color" desc="Highlight & interactive color">
          <AccentGrid />
        </Section>

        {/* CHAT DENSITY */}
        <Section title="Chat Density" desc="Message spacing & layout">
          <OptionRow label="Compact" />
          <OptionRow label="Comfortable" />
        </Section>

        {/* VISUAL EFFECTS */}
        <Section title="Visual Effects" desc="Cyber effects & animations">
          <Toggle label="Blur Background" />
          <Toggle label="Neon Glow Highlights" />
          <Toggle label="Smooth Animations" />
        </Section>

        {/* BACKGROUND */}
        <Section title="Chat Background" desc="Subtle visual texture">
          <OptionRow label="Solid" />
          <OptionRow label="Grid Pattern" />
          <OptionRow label="Noise Texture" />
        </Section>
      </div>
    </aside>
  );
}

/* =========================
   SECTION
========================= */
function Section({ title, desc, children }: any) {
  return (
    <div className="p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-gray-400 mt-1">{desc}</p>
      </div>
      {children}
    </div>
  );
}

/* =========================
   THEME CARD
========================= */
function ThemeCard({ label, active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-xl border transition text-left cursor-pointer
        ${
          active
            ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_#22d3ee33]"
            : "border-white/10 hover:border-white/30"
        }`}
    >
      <div className="w-full h-14 rounded-lg bg-black/40 flex items-center justify-center mb-2">
        {children}
      </div>
      <div className="text-xs font-medium">{label}</div>
    </button>
  );
}

/* =========================
   OPTION ROW (FIXED)
========================= */
function OptionRow({ label }: any) {
  return (
    <div
      className="
        flex justify-between items-center
        px-3 py-2.5
        rounded-lg
        cursor-pointer
        border border-transparent
        hover:border-cyan-400/30
        hover:bg-cyan-500/5
        transition
      "
    >
      <span className="text-sm">{label}</span>
    </div>
  );
}

/* =========================
   ACCENT COLOR
========================= */
function AccentGrid() {
  const colors = [
    "bg-cyan-400",
    "bg-emerald-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-yellow-400",
  ];

  return (
    <div className="flex gap-3">
      {colors.map((c) => (
        <button
          key={c}
          className={`w-7 h-7 rounded-full ${c} shadow hover:scale-110 transition`}
        />
      ))}
    </div>
  );
}

/* =========================
   CYBER TOGGLE
========================= */
function Toggle({ label }: any) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm">{label}</span>

      <button
        onClick={() => setActive(!active)}
        className={`relative w-11 h-6 rounded-full border transition
          ${
            active
              ? "bg-cyan-500/25 border-cyan-400/40"
              : "bg-white/10 border-white/10"
          }`}
      >
        <div
          className={`absolute top-1/2 left-[3px] w-4 h-4 rounded-full -translate-y-1/2 transition
            ${
              active
                ? "translate-x-5 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                : "bg-gray-400"
            }`}
        />
      </button>
    </div>
  );
}

/* =========================
   SVG ICONS (UPGRADED)
========================= */

function DarkIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="darkGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <path
        d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"
        fill="url(#darkGlow)"
      />
    </svg>
  );
}

function LightIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" fill="#facc15" />
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="#facc15"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      <g stroke="#facc15" strokeWidth="1.5">
        <line x1="12" y1="1.5" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22.5" />
        <line x1="1.5" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22.5" y2="12" />
      </g>
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="sysSplit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#facc15" />
        </linearGradient>
      </defs>
      <rect
        x="3"
        y="4"
        width="18"
        height="14"
        rx="3"
        fill="url(#sysSplit)"
        fillOpacity="0.15"
        stroke="url(#sysSplit)"
        strokeWidth="1.5"
      />
      <line
        x1="12"
        y1="4"
        x2="12"
        y2="18"
        stroke="url(#sysSplit)"
        strokeWidth="1"
      />
    </svg>
  );
}
