"use client";

import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";

// =====================
// IMPORT SUB-PAGES
// =====================
import LastSeenPage from "./LastSeenPage";
import ForwardingPage from "./ForwardingPage";
import BlockedUsersPage from "./BlockedUserPage";
import MutedUsersPage from "./MutedUsersPage";
import RestrictedUsersPage from "./RestrictedUsersPage";
import DataOnChainPage from "./DataOnChainPage";
import ActiveSessionsPage from "./ActiveSessionsPage";
import { IconArrowRight } from "@/components/icons";

// =====================
// PRIVACY PAGE INDEX
// =====================
const pages: any = {
  lastSeen: { title: "Last Seen & Online", component: LastSeenPage },
  forwarding: { title: "Forwarded Messages", component: ForwardingPage },
  blocked: { title: "Blocked Users", component: BlockedUsersPage },
  muted: { title: "Muted Users", component: MutedUsersPage },
  restricted: { title: "Restricted Users", component: RestrictedUsersPage },
  sessions: { title: "Active Sessions", component: ActiveSessionsPage },
  datachain: { title: "Data Stored on Chain", component: DataOnChainPage },
};

// =====================
// MAIN SETTINGS PAGE
// =====================
export default function PrivacySetting({ data, onClose }: any) {
  const [activePage, setActivePage] = useState<null | keyof typeof pages>(null);

  const PageComponent = activePage ? pages[activePage].component : null;
  const pageTitle = activePage ? pages[activePage].title : "Privacy & Security";

  return (
    <aside className="relative h-full bg-[--background] text-gray-200 flex flex-col">
      {/* HEADER */}
      <div className="p-4 pt-2.5 flex items-center justify-between">
        <h2 className="text-md font-semibold ">{pageTitle}</h2>

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
          {/* BASIC PRIVACY */}
          <MenuItem
            label="Last Seen & Online"
            sub="Everyone"
            onClick={() => setActivePage("lastSeen")}
          />
          <ToggleItem label="Read Receipts" />
          <ToggleItem label="Typing Indicator" />

          {/* MESSAGE PRIVACY */}
          <MenuItem
            label="Forwarded Messages"
            sub="Nobody can link back"
            onClick={() => setActivePage("forwarding")}
          />
          <ToggleItem label="Allow Forwarding" />
          <ToggleItem label="Show Sender Attribution" />
          <ToggleItem label="Include Message Hash (Blockchain)" />

          {/* WALLET PRIVACY */}
          <ToggleItem label="Hide Wallet Address" />
          <ToggleItem label="Mask Identity (0x12…89EF)" />

          {/* SECURITY */}
          <ToggleItem label="End-to-End Encryption" />
          <ToggleItem label="Screenshot Protection" />
          <ToggleItem label="Disable Chat Export" />

          {/* CONTACT CONTROL */}
          <MenuItem
            label="Blocked Users"
            sub="3 users blocked"
            onClick={() => setActivePage("blocked")}
          />
          <MenuItem
            label="Muted Users"
            onClick={() => setActivePage("muted")}
          />
          <MenuItem
            label="Restricted Users"
            onClick={() => setActivePage("restricted")}
          />

          {/* SESSIONS */}
          <MenuItem
            label="Active Sessions"
            onClick={() => setActivePage("sessions")}
          />

          {/* BLOCKCHAIN DATA */}
          <MenuItem
            label="Data Stored on Chain"
            onClick={() => setActivePage("datachain")}
          />
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
// MENU ITEM (ARROW)
// =====================
function MenuItem({ label, sub, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center p-4 cursor-pointer hover:bg-white/5"
    >
      <div>
        <div className="text-sm font-medium ">{label}</div>
        {sub && <div className="text-xs  text-gray-400">{sub}</div>}
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
      <span className="text-sm ">{label}</span>

      <button
        onClick={() => setActive(!active)}
        className={`w-11 h-6 rounded-full transition px-1 flex items-center cursor-pointer ${
          active ? "bg-green-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
            active ? "translate-x-4" : "translate-x-0"
          }`}
        ></div>
      </button>
    </div>
  );
}
