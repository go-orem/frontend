"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import HeaderSidebarPanel from "./HeaderSidebarPanel";
import { MobileMenu, Search } from "@/components/UI";

import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Video,
  Camera,
  Hash,
  ShieldCheck,
  X,
} from "lucide-react";

// ------------------------
// Types
// ------------------------
type CallType = "incoming" | "outgoing" | "missed";

type CallItem = {
  id: number;
  username: string;
  timestamp: string;
  type: CallType;
  duration: string;
  isVideo?: boolean;
  callHash?: string | null;
  snapshotHash?: string | null;
  pinnedTx?: string | null;
  trustScore?: number; // 0..100
};

// ------------------------
// Helpers: hashing (SHA-256), hex conversion
// ------------------------
async function sha256Hex(input: string | ArrayBuffer): Promise<string> {
  const data =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : input instanceof ArrayBuffer
      ? new Uint8Array(input)
      : input;
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
}

// ------------------------
// Mock blockchain functions (replace with real implementations)
// ------------------------
async function pinToChain(payloadHash: string, meta: Record<string, any>) {
  await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
  const fakeTx =
    "0x" +
    (Math.random().toString(16).slice(2, 10) + Date.now().toString(16)).slice(
      0,
      64
    );
  return { tx: fakeTx, timestamp: Date.now() };
}

async function getOnChainProof(txHash: string) {
  await new Promise((r) => setTimeout(r, 600));
  return {
    txHash,
    blockNumber: 123456 + Math.floor(Math.random() * 1000),
    confirmed: true,
  };
}

// ------------------------
// UI helpers
// ------------------------
function callIconForType(type: CallType) {
  if (type === "incoming") return <PhoneIncoming size={14} />;
  if (type === "outgoing") return <PhoneOutgoing size={14} />;
  return <Phone size={14} />;
}

function callColorForType(type: CallType) {
  if (type === "missed") return "text-red-400";
  if (type === "incoming") return "text-emerald-400";
  return "text-sky-400";
}

// ------------------------
// Single Call Row (modern)
// ------------------------
function CallRow({
  call,
  onStartVideo,
  onStartAudio,
  onSnapshot,
  onPinCall,
  onVerify,
}: {
  call: CallItem;
  onStartVideo: (id: number) => void;
  onStartAudio: (id: number) => void;
  onSnapshot: (id: number) => void;
  onPinCall: (id: number) => void;
  onVerify: (id: number) => void;
}) {
  const trust = call.trustScore ?? 60;
  const ringColor =
    trust > 75
      ? "ring-emerald-400"
      : trust > 45
      ? "ring-amber-400"
      : "ring-red-400";

  return (
    <motion.div
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ translateY: -4 }}
      className="group"
    >
      <div
        className="
          flex items-center gap-4 p-3 rounded-2xl
          bg-linear-to-b from-white/3 to-white/2
          border border-white/6
          shadow-lg shadow-black/20
          hover:shadow-xl hover:shadow-black/25
          transition-all duration-200
          select-none
        "
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ring-2 ${ringColor} ring-opacity-70`}
            style={{
              background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
            }}
            title={`Trust ${trust}%`}
          >
            {call.username.charAt(0)}
          </div>
          <div
            className={`absolute -right-1 -bottom-1 w-4 h-4 rounded-full border border-white/10 ${
              trust > 70
                ? "bg-emerald-400"
                : trust > 40
                ? "bg-amber-400"
                : "bg-red-400"
            }`}
            title={`Trust ${trust}%`}
          />
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white truncate">
                  {call.username}
                </p>
                {/* small chip if video */}
                {call.isVideo && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-linear-to-r from-violet-600 to-cyan-400 text-black font-medium">
                    <Video size={12} />
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate">{call.timestamp}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-xs text-gray-300 text-right">
                <div>{call.duration}</div>
                <div className="text-[11px] text-gray-500">
                  {call.type === "missed" ? "Missed" : call.type}
                </div>
              </div>

              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border border-white/10 ${callColorForType(
                  call.type
                )} bg-black/30`}
                title={call.type}
              >
                {callIconForType(call.type)}
              </div>
            </div>
          </div>

          {/* bottom row: subtle actions / badges */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <div className="flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>{`Trust ${trust}%`}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {call.pinnedTx && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 text-[12px] flex items-center gap-1">
                  <ShieldCheck size={12} />
                </span>
              )}

              {/* action icons (small & subtle) */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onSnapshot(call.id)}
                  className="p-2 rounded-lg hover:bg-white/6"
                  title="Snapshot"
                >
                  <Camera size={14} className="text-gray-200" />
                </button>
                <button
                  onClick={() => onPinCall(call.id)}
                  className="p-2 rounded-lg hover:bg-white/6"
                  title="Pin to chain"
                >
                  <Hash size={14} className="text-gray-200" />
                </button>
                <button
                  onClick={() => onVerify(call.id)}
                  className="p-2 rounded-lg hover:bg-white/6"
                  title="Verify on chain"
                >
                  <ShieldCheck size={14} className="text-gray-200" />
                </button>
              </div>

              {/* call controls */}
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => onStartAudio(call.id)}
                  className="px-3 py-1 rounded-full bg-white/6 hover:bg-white/10 text-[13px] flex items-center gap-2"
                  title="Start audio"
                >
                  <Phone size={14} />
                </button>
                <button
                  onClick={() => onStartVideo(call.id)}
                  className="px-3 py-1 rounded-full bg-linear-to-r from-violet-500 to-cyan-400 text-black text-[13px] flex items-center gap-2 shadow-sm"
                  title="Start video"
                >
                  <Video size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ------------------------
// Calls list container (filter + state)
// ------------------------
function CallsListContainer() {
  const [calls, setCalls] = useState<CallItem[]>(() => [
    {
      id: 1,
      username: "John Doe",
      timestamp: "10:30 AM",
      type: "incoming",
      duration: "5m 23s",
      isVideo: false,
      callHash: null,
      snapshotHash: null,
      pinnedTx: null,
      trustScore: 82,
    },
    {
      id: 2,
      username: "Jane Smith",
      timestamp: "09:15 AM",
      type: "outgoing",
      duration: "12m 45s",
      isVideo: true,
      callHash: null,
      snapshotHash: null,
      pinnedTx: null,
      trustScore: 63,
    },
    {
      id: 3,
      username: "Mike Johnson",
      timestamp: "Kemarin",
      type: "missed",
      duration: "-",
      isVideo: false,
      callHash: null,
      snapshotHash: null,
      pinnedTx: null,
      trustScore: 44,
    },
  ]);

  const [filter, setFilter] = useState<"all" | "missed" | "video">("all");
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const [proofModal, setProofModal] = useState<{
    open: boolean;
    call?: CallItem;
  }>({
    open: false,
  });

  const updateCall = (id: number, patch: Partial<CallItem>) => {
    setCalls((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  // actions
  const onStartAudio = (id: number) => {
    const call = calls.find((c) => c.id === id);
    if (!call) return;
    const meta = {
      id: call.id,
      username: call.username,
      type: "audio",
      startedAt: Date.now(),
      sessionNonce: Math.random().toString(16).slice(2),
    };
    sha256Hex(JSON.stringify(meta)).then((h) =>
      updateCall(id, { callHash: h })
    );
  };

  const onStartVideo = async (id: number) => {
    const call = calls.find((c) => c.id === id);
    if (!call) return;
    const meta = {
      id: call.id,
      username: call.username,
      type: "video",
      startedAt: Date.now(),
      sessionNonce: Math.random().toString(16).slice(2),
    };
    const h = await sha256Hex(JSON.stringify(meta));
    updateCall(id, { callHash: h, isVideo: true });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const v = videoRefs.current[id];
      if (v) {
        v.srcObject = stream;
        v.play().catch(() => {});
      } else {
        const temp = document.createElement("video");
        temp.autoplay = true;
        temp.muted = true;
        temp.playsInline = true;
        temp.srcObject = stream;
        videoRefs.current[id] = temp;
      }
    } catch (err) {
      console.error("getUserMedia failed", err);
    }
  };

  const onSnapshot = async (id: number) => {
    const v = videoRefs.current[id];
    if (!v) {
      alert("No active video stream for this call.");
      return;
    }
    const w = v.videoWidth || 640;
    const h = v.videoHeight || 360;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("Unable to capture snapshot.");
      return;
    }
    ctx.drawImage(v, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob((b) => res(b), "image/png")
    );
    if (!blob) {
      alert("Snapshot failed.");
      return;
    }
    const arrayBuffer = await blob.arrayBuffer();
    const snapshotHash = await sha256Hex(arrayBuffer);
    updateCall(id, { snapshotHash });
    alert(`Snapshot hash: ${snapshotHash.slice(0, 12)}...`);
  };

  const onPinCall = async (id: number) => {
    const call = calls.find((c) => c.id === id);
    if (!call) return;
    const meta = {
      id: call.id,
      username: call.username,
      callHash: call.callHash,
      snapshotHash: call.snapshotHash,
      timestamp: Date.now(),
    };
    const payloadHash = await sha256Hex(JSON.stringify(meta));
    const res = await pinToChain(payloadHash, meta);
    updateCall(id, { pinnedTx: res.tx });
    alert(`Pinned (mock). Tx: ${res.tx.slice(0, 10)}...`);
  };

  const onVerify = async (id: number) => {
    const call = calls.find((c) => c.id === id);
    if (!call || !call.pinnedTx) {
      alert("No on-chain proof for this call.");
      return;
    }
    const proof = await getOnChainProof(call.pinnedTx);
    setProofModal({ open: true, call: { ...call, pinnedTx: proof.txHash } });
  };

  const closeProof = () => setProofModal({ open: false });

  // filtered list
  const filtered = calls.filter((c) =>
    filter === "all"
      ? true
      : filter === "missed"
      ? c.type === "missed"
      : c.isVideo
  );

  return (
    <>
      {/* Filter Tabs */}
      <div className="px-0 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/3 p-1 rounded-full px-2">
          <button
            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
              filter === "all" ? "bg-(--primarycolor)/10 text-white" : "text-gray-300"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
              filter === "missed" ? "bg-(--primarycolor)/10 text-white" : "text-gray-300"
            }`}
            onClick={() => setFilter("missed")}
          >
            Missed
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
              filter === "video" ? "bg-(--primarycolor)/10 text-white" : "text-gray-300"
            }`}
            onClick={() => setFilter("video")}
          >
            Video
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 px-0 pb-6 py-1">
        {filtered.map((call) => (
          <CallRow
            key={call.id}
            call={call}
            onStartAudio={onStartAudio}
            onStartVideo={onStartVideo}
            onSnapshot={onSnapshot}
            onPinCall={onPinCall}
            onVerify={onVerify}
          />
        ))}
      </div>

      {/* hidden video refs */}
      <div className="hidden" aria-hidden>
        {calls.map((c) =>
          c.isVideo ? (
            <video
              key={`video-${c.id}`}
              ref={(el) => {
                videoRefs.current[c.id] = el;
              }}
              autoPlay
              muted
              playsInline
              style={{ width: 320, height: 180 }}
            />
          ) : null
        )}
      </div>

      {/* proof modal */}
      {proofModal.open && proofModal.call ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60" onClick={closeProof} />
          <div className="relative w-full max-w-lg bg-[#071022] border border-white/8 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                On-Chain Proof
              </h3>
              <button
                onClick={closeProof}
                className="p-1 rounded hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-300 space-y-2">
              <div>
                <div className="text-[11px] text-gray-400">User</div>
                <div className="text-sm">{proofModal.call.username}</div>
              </div>

              <div>
                <div className="text-[11px] text-gray-400">Pinned Tx</div>
                <div className="text-xs break-all">
                  {proofModal.call.pinnedTx}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-gray-400">Call Hash</div>
                <div className="text-xs break-all">
                  {proofModal.call.callHash ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-gray-400">Snapshot Hash</div>
                <div className="text-xs break-all">
                  {proofModal.call.snapshotHash ?? "—"}
                </div>
              </div>

              <div className="mt-3">
                <button
                  onClick={async () => {
                    if (!proofModal.call?.pinnedTx) {
                      alert("No tx for this call.");
                      return;
                    }
                    const r = await getOnChainProof(proofModal.call.pinnedTx);
                    alert(
                      `Block ${r.blockNumber}, confirmed: ${
                        r.confirmed ? "yes" : "no"
                      }`
                    );
                  }}
                  className="px-3 py-2 rounded-lg bg-linear-to-r from-emerald-400 to-sky-400 text-black text-sm font-medium"
                >
                  Verify on Chain
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

// ------------------------
// Main Sidebar Component
// ------------------------
export default function CallsSidebarPanel({
  onMenuClick,
  activeIndex,
}: {
  onMenuClick?: (index: number) => void;
  activeIndex?: number;
} = {}) {
  const [sidebarWidth, setSidebarWidth] = useState<number>(430);
  const [previewWidth, setPreviewWidth] = useState<number>(430);
  const [loaded, setLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarWidth");
    const width = saved ? parseInt(saved) : 430;
    setSidebarWidth(width);
    setPreviewWidth(width);
    setLoaded(true);
  }, []);

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newWidth = e.clientX;
    if (newWidth > 260 && newWidth < 900) {
      setPreviewWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setSidebarWidth(previewWidth);
    localStorage.setItem("sidebarWidth", previewWidth.toString());
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, previewWidth]);

  return (
    <div className={`flex h-screen ${isDragging ? "select-none" : ""}`}>
      <motion.div
        className="max-w-full flex flex-col pt-3 border-r border-gray-700 bg-[--sidebar-bg] overflow-hidden"
        initial={false}
        animate={{ width: isDragging ? previewWidth : sidebarWidth }}
        transition={
          loaded
            ? { type: "spring", stiffness: 300, damping: 35 }
            : { duration: 0 }
        }
      >
        <HeaderSidebarPanel activeTab="calls" />

        <Search />

        <div className="flex-1 overflow-y-auto custom-scroll px-5">
          <CallsListContainer />
        </div>

        <MobileMenu onMenuClick={onMenuClick} activeIndex={activeIndex} />
      </motion.div>

      <div
        onMouseDown={handleMouseDown}
        className={`cursor-col-resize w-[0.5px] ${
          isDragging ? "bg-[--primarycolor]" : "bg-gray-700"
        }`}
      />

      <div className="flex-1 bg-[--content-bg]" />
    </div>
  );
}
