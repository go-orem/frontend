"use client";

import React, { useRef, useState } from "react";
import CardBalance from "./CardBalance";
import {
  ChartToken,
  AreaChartSVG,
  DonutChartSVG,
  BarChartSVG,
  WaveformSVG,
} from "./ChartToken";

import MobileNavFooter from "./MobileNavFooter";
import WalletOrem from "@/app/components/icons/IconWallet/WalletOrem";
import ReceiveOrem from "@/app/components/icons/IconWallet/ReceiveOrem";
import SendQrOrem from "@/app/components/icons/IconWallet/SendQrOrem";

interface WalletSettingsProps {
  data: any;
  onClose: () => void;
}

export default function WalletSettings({ data, onClose }: WalletSettingsProps) {
  // tabs
  const tabs = [
    { id: "line", label: "Line" },
    { id: "area", label: "Area" },
    { id: "bar", label: "Bar" },
    { id: "donut", label: "Donut" },
    { id: "wave", label: "Wave" },
  ];
  const [activeTab, setActiveTab] = useState("line");

  const IconWallet = [
    { icon: <SendQrOrem />, label: "QR" },
    { icon: <SendQrOrem />, label: "Send" },
    { icon: <ReceiveOrem />, label: "Receive" },
    { icon: <WalletOrem />, label: "Swap" },
  ];

  // sample data
  const lineData = [2.3, 10.3, 4.5, 7.8];
  const barData = [1.3, 2.906, 2.1, 5.89];
  const donutData = [
    { name: "A", value: 3.4 },
    { name: "B", value: 2.93 },
    { name: "C", value: 0.0039 },
  ];

  // slider refs for dragging
  const slider = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const momentumID = useRef<number | null>(null);

  const momentum = () => {
    if (!slider.current) return;
    const friction = 0.95;
    velocity.current *= friction;
    slider.current.scrollLeft -= velocity.current;
    if (Math.abs(velocity.current) > 0.3) {
      momentumID.current = requestAnimationFrame(momentum);
    } else {
      cancelAnimationFrame(momentumID.current!);
      momentumID.current = null;
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!slider.current) return;
    isDragging.current = true;
    slider.current.classList.add("cursor-grabbing");
    startX.current = e.pageX - slider.current.offsetLeft;
    scrollLeft.current = slider.current.scrollLeft;
    velocity.current = 0;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    if (momentumID.current) cancelAnimationFrame(momentumID.current);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !slider.current) return;
    e.preventDefault();
    const x = e.pageX - slider.current.offsetLeft;
    const walk = x - startX.current;
    slider.current.scrollLeft = scrollLeft.current - walk;

    const now = Date.now();
    const dx = e.pageX - lastX.current;
    const dt = now - lastTime.current;
    velocity.current = (dx / dt) * 20;
    lastX.current = e.pageX;
    lastTime.current = now;
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    slider.current?.classList.remove("cursor-grabbing");
    momentum();
  };

  return (
    <aside className="w-full h-full bg-[--background] text-gray-100 flex flex-col p-4 pb-28 font-mono relative overflow-y-auto">
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-4 backdrop-blur-xl z-50">
        <h2 className="text-xl font-bold tracking-wide">OREM Wallet</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* NETWORK STATUS */}
      <div className="flex items-center gap-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-3 mt-12">
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm text-gray-300">
          Connected to{" "}
          <span className="text-[#30d5ff] font-bold">OREM Network</span>
        </span>
      </div>

      {/* BALANCE */}
      <CardBalance data={data} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { icon: "💎", name: "OREM-X", amt: "12.4", usd: "7.12" },
          { icon: "🔥", name: "OREM-Burn", amt: "4.9", usd: "1.03" },
        ].map((a, i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2 hover:border-[#30d5ff]/40 transition"
          >
            <div className="w-8 h-8 rounded-full bg-[#30d5ff]/20 flex items-center justify-center text-lg">
              {a.icon}
            </div>
            <div>
              <p className="text-sm font-bold">{a.name}</p>
              <p className="text-xs text-gray-400">
                {a.amt} • ${a.usd}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ADDRESS */}
      <div className="mt-5 backdrop-blur-xl bg-white/5 rounded-lg p-3 border border-white/10">
        <p className="text-xs text-gray-400">Wallet Address</p>
        <p className="text-sm font-semibold mt-1 truncate">
          {data?.address ?? "0x000...000"}
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-4 gap-3 mt-6">
        {IconWallet.map((b, i) => (
          <button
            key={i}
            className="backdrop-blur-xl bg-white/5 hover:bg-white/10 transition rounded-xl p-3 flex flex-col items-center gap-1 border border-white/10"
          >
            <span className="text-xl">{b.icon}</span>
            <span className="text-xs">{b.label}</span>
          </button>
        ))}
      </div>

      {/* ASSETS */}
      <div className="mt-7">
        <h3 className="text-sm text-gray-400 mb-2">Your Assets</h3>
        <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#30d5ff]/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#30d5ff]/20 border border-[#30d5ff] flex items-center justify-center text-[22px]">
                🪙
              </div>
              <div>
                <p className="font-bold text-white">OREM</p>
                <p className="text-xs text-gray-400">Main Token</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">
                {data?.balance ?? "0"} OREM
              </p>
              <p className="text-xs text-gray-400">
                ${data?.balanceUSD ?? "0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDER TABS */}
      <div
        ref={slider}
        className="w-full overflow-x-auto shrink-0 pb-3 pl-2 pr-2 cursor-grab select-none mt-7"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        <div className="flex space-x-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="group relative flex flex-col items-center justify-center pb-1 cursor-pointer"
              >
                <div
                  className={`flex items-center font-mono text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-[#30d5ff]"
                      : "text-gray-400 group-hover:text-[#30d5ff]"
                  }`}
                >
                  {tab.label}
                </div>
                <span
                  className={`absolute -bottom-1 h-1 rounded-full bg-[#30d5ff] transition-all duration-300 ease-in-out ${
                    isActive
                      ? "w-10 opacity-100"
                      : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* CHART DISPLAY */}
      <div className="mt-4 h-48 p-3 flex justify-center w-full">
        {activeTab === "line" && <ChartToken data={lineData} />}
        {activeTab === "area" && <AreaChartSVG data={barData} />}
        {activeTab === "bar" && <BarChartSVG data={barData} />}
        {activeTab === "donut" && <DonutChartSVG data={donutData} />}
        {activeTab === "wave" && <WaveformSVG data={lineData} />}
      </div>

      {/* FOOTER NAV */}
      <MobileNavFooter />
    </aside>
  );
}
