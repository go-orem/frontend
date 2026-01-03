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
  const pageTitle = activePage ? pages[activePage].title : "Notifications";

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
          {/* MESSAGE */}
          <MenuItem
            label="Private Messages"
            sub="All encrypted chats"
            onClick={() => setActivePage("message")}
          />
          <ToggleItem label="Message Preview" />
          <ToggleItem label="Show Sender Name" />

          {/* GROUP */}
          <MenuItem
            label="Private Groups"
            sub="Mentions only"
            onClick={() => setActivePage("group")}
          />
          <ToggleItem label="Group Mentions Only" />

          {/* PUBLIC GROUP */}
          <MenuItem
            label="Public Groups & Channels"
            sub="High traffic control"
            onClick={() => setActivePage("publicGroup")}
          />
          <ToggleItem label="Mute Large Groups (>1k)" />
          <ToggleItem label="Auto-Mute New Public Groups" />

          {/* MENTIONS */}
          <MenuItem
            label="Mentions & Replies"
            sub="@username alerts"
            onClick={() => setActivePage("mentions")}
          />
          <ToggleItem label="Notify on @Mention" />
          <ToggleItem label="Notify on Reply" />

          {/* SOUND */}
          <MenuItem
            label="Sound & Vibration"
            onClick={() => setActivePage("sound")}
          />
          <ToggleItem label="Vibration" />
          <ToggleItem label="Silent Mode" />

          {/* ON-CHAIN */}
          <MenuItem
            label="On-Chain Notifications"
            sub="Smart contract events"
            onClick={() => setActivePage("onchain")}
          />
          <ToggleItem label="Message Anchored on Chain" />
          <ToggleItem label="DAO / Proposal Alerts" />
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
// MENU ITEM
// =====================
function MenuItem({ label, sub, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center p-4 cursor-pointer hover:bg-white/5"
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
function ToggleItem({ label }: any) {
  const [active, setActive] = useState(false);

  return (
    <div className="flex justify-between items-center p-4 hover:bg-white/5">
      <span className="text-sm">{label}</span>

      <button
        onClick={() => setActive(!active)}
        className={`w-11 h-6 rounded-full transition px-1 flex items-center ${
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
