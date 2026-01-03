"use client";

import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { IconArrowRight } from "@/components/icons";

// =====================
// SUB PAGES (NOTIFICATION)
// =====================
import MessageNotifPage from "./MessageNotifPage";
import GroupNotifPage from "./GroupNotifPage";
import PublicGroupNotifPage from "./PublicGroupNotifPage";
import MentionsPage from "./MentionsPage";
import SoundVibrationPage from "./SoundVibrationPage";
import OnChainAlertPage from "./OnChainAlertPage";

// =====================
// PAGE INDEX
// =====================
const pages: any = {
  message: { title: "Private Messages", component: MessageNotifPage },
  group: { title: "Private Groups", component: GroupNotifPage },
  publicGroup: { title: "Public Groups & Channels", component: PublicGroupNotifPage },
  mentions: { title: "Mentions & Replies", component: MentionsPage },
  sound: { title: "Sound & Vibration", component: SoundVibrationPage },
  onchain: { title: "On-Chain Notifications", component: OnChainAlertPage },
};

// =====================
// MAIN NOTIFICATION PAGE
// =====================
export default function NotificationSetting({ data, onClose }: any) {
  const [activePage, setActivePage] = useState<null | keyof typeof pages>(null);

  const PageComponent = activePage ? pages[activePage].component : null;
  const pageTitle = activePage ? pages[activePage].title : "Notification";

  return (
    <aside className="relative h-full bg-[--background] text-gray-200 flex flex-col">
      {/* HEADER */}
      <div className="p-4 pt-2.5 flex items-center justify-between">
        <h2 className="text-md font-semibold">{pageTitle}</h2>

        {activePage ? (
          <button
            onClick={() => setActivePage(null)}
            className="p-2 rounded-full bg-black/40 hover:bg-(--hovercolor)"
          >
            <IconArrowRight />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-(--hovercolor)"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* MAIN MENU */}
      {!activePage && (
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">

          {/* ================= MESSAGE NOTIFICATIONS ================= */}
          <Section
            title="Private Messages"
            desc="Control notifications for end-to-end encrypted chats"
          >
            <MenuItem
              label="Private Messages"
              sub="All encrypted conversations"
              onClick={() => setActivePage("message")}
            />
            <ToggleItem
              label="Message Preview"
              desc="Show message content in notification banner"
            />
            <ToggleItem
              label="Show Sender Name"
              desc="Display sender identity on notifications"
            />
          </Section>

          {/* ================= GROUP NOTIFICATIONS ================= */}
          <Section
            title="Private Groups"
            desc="Manage notifications from private group chats"
          >
            <MenuItem
              label="Private Groups"
              sub="Mentions only"
              onClick={() => setActivePage("group")}
            />
            <ToggleItem
              label="Group Mentions Only"
              desc="Notify only when someone mentions you"
            />
          </Section>

          {/* ================= PUBLIC GROUPS ================= */}
          <Section
            title="Public Groups & Channels"
            desc="Reduce noise from high-traffic communities"
          >
            <MenuItem
              label="Public Groups & Channels"
              sub="High traffic control"
              onClick={() => setActivePage("publicGroup")}
            />
            <ToggleItem
              label="Mute Large Groups (>1k)"
              desc="Automatically mute very large public groups"
            />
            <ToggleItem
              label="Auto-Mute New Public Groups"
              desc="Prevent spam when joining new communities"
            />
          </Section>

          {/* ================= MENTIONS ================= */}
          <Section
            title="Mentions & Replies"
            desc="Direct interactions that require attention"
          >
            <MenuItem
              label="Mentions & Replies"
              sub="@username alerts"
              onClick={() => setActivePage("mentions")}
            />
            <ToggleItem
              label="Notify on @Mention"
              desc="Alert when someone mentions your username"
            />
            <ToggleItem
              label="Notify on Reply"
              desc="Get notified when someone replies to your message"
            />
          </Section>

          {/* ================= SOUND ================= */}
          <Section
            title="Sound & Vibration"
            desc="Notification feedback preferences"
          >
            <MenuItem
              label="Sound & Vibration"
              onClick={() => setActivePage("sound")}
            />
            <ToggleItem
              label="Vibration"
              desc="Enable vibration feedback"
            />
            <ToggleItem
              label="Silent Mode"
              desc="Disable all sounds temporarily"
            />
          </Section>

          {/* ================= ON-CHAIN ================= */}
          <Section
            title="On-Chain Notifications"
            desc="Blockchain & smart contract based alerts"
          >
            <MenuItem
              label="On-Chain Notifications"
              sub="Smart contract events"
              onClick={() => setActivePage("onchain")}
            />
            <ToggleItem
              label="Message Anchored on Chain"
              desc="Notify when message hashes are anchored on blockchain"
            />
            <ToggleItem
              label="DAO / Proposal Alerts"
              desc="Alerts for DAO voting & governance activity"
            />
          </Section>
        </div>
      )}

      {/* SUB PAGE */}
      {activePage && (
        <div className="absolute left-0 right-0 bottom-0 top-[52px] bg-[--background] animate-slideLeft">
          <PageComponent onBack={() => setActivePage(null)} data={data} />
        </div>
      )}
    </aside>
  );
}

// =====================
// SECTION WRAPPER
// =====================
function Section({ title, desc, children }: any) {
  return (
    <div className="py-2">
      <div className="px-4 pt-3 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
      </div>
      {children}
    </div>
  );
}

// =====================
// MENU ITEM
// =====================
function MenuItem({ label, sub, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-white/5"
    >
      <div>
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-gray-400">{sub}</div>}
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </div>
  );
}

// =====================
// TOGGLE ITEM
// =====================
function ToggleItem({ label, desc }: any) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center px-4 py-3 hover:bg-white/5">
      {/* TEXT AREA */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="text-sm leading-snug">{label}</div>
        {desc && (
          <div className="text-xs text-gray-500 leading-snug">
            {desc}
          </div>
        )}
      </div>

      {/* TOGGLE (FIXED SIZE) */}
      <button
        onClick={() => setActive(!active)}
        className={`shrink-0 w-11 h-6 rounded-full transition px-1 flex items-center ${
          active ? "bg-green-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
            active ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

