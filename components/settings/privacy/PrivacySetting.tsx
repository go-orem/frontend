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

          {/* ================= VISIBILITY & PRESENCE ================= */}
          <GroupHeader
            title="Visibility & Presence"
            desc="Control how others see your activity"
          />

          <MenuItem
            label="Last Seen & Online"
            sub="Who can see when you're online"
            onClick={() => setActivePage("lastSeen")}
          />
          <ToggleItem
            label="Read Receipts"
            desc="Let others know when you read their messages"
          />
          <ToggleItem
            label="Typing Indicator"
            desc="Show when you're typing a reply"
          />

          {/* ================= MESSAGE PRIVACY ================= */}
          <GroupHeader
            title="Message Privacy"
            desc="Control message forwarding & metadata"
          />

          <MenuItem
            label="Forwarded Messages"
            sub="Prevent messages from being traced"
            onClick={() => setActivePage("forwarding")}
          />
          <ToggleItem
            label="Allow Forwarding"
            desc="Allow others to forward your messages"
          />
          <ToggleItem
            label="Show Sender Attribution"
            desc="Display original sender information"
          />
          <ToggleItem
            label="Include Message Hash (Blockchain)"
            desc="Attach immutable proof to each message"
          />

          {/* ================= IDENTITY & WALLET ================= */}
          <GroupHeader
            title="Identity & Wallet Privacy"
            desc="Protect your on-chain identity"
          />

          <ToggleItem
            label="Hide Wallet Address"
            desc="Do not expose your full wallet address publicly"
          />
          <ToggleItem
            label="Mask Identity (0x12…89EF)"
            desc="Show shortened wallet format instead of full address"
          />

          {/* ================= SECURITY ================= */}
          <GroupHeader
            title="Security & Protection"
            desc="Advanced privacy and data protection"
          />

          <ToggleItem
            label="End-to-End Encryption"
            desc="Only you and the recipient can read messages"
          />
          <ToggleItem
            label="Screenshot Protection"
            desc="Block screenshots in sensitive chats"
          />
          <ToggleItem
            label="Disable Chat Export"
            desc="Prevent chat history from being exported"
          />

          {/* ================= CONTACT CONTROL ================= */}
          <GroupHeader
            title="Contact Control"
            desc="Manage how specific users interact with you"
          />

          <MenuItem
            label="Blocked Users"
            sub="People who cannot contact you"
            onClick={() => setActivePage("blocked")}
          />
          <MenuItem
            label="Muted Users"
            sub="Messages hidden without notifying sender"
            onClick={() => setActivePage("muted")}
          />
          <MenuItem
            label="Restricted Users"
            sub="Limited visibility & interaction"
            onClick={() => setActivePage("restricted")}
          />

          {/* ================= SESSIONS ================= */}
          <GroupHeader
            title="Sessions & Devices"
            desc="Manage logged-in devices"
          />

          <MenuItem
            label="Active Sessions"
            sub="Devices currently logged into your account"
            onClick={() => setActivePage("sessions")}
          />

          {/* ================= BLOCKCHAIN ================= */}
          <GroupHeader
            title="On-Chain Transparency"
            desc="Control what data is stored on blockchain"
          />

          <MenuItem
            label="Data Stored on Chain"
            sub="View publicly verifiable data"
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
// GROUP HEADER
// =====================
function GroupHeader({ title, desc }: any) {
  return (
    <div className="px-4 pt-5 pb-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </div>
      {desc && (
        <div className="text-[11px] text-gray-500 mt-0.5">
          {desc}
        </div>
      )}
    </div>
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
    <div className="flex justify-between items-center gap-4 p-4 hover:bg-white/5">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && (
          <div className="text-xs text-gray-400 mt-0.5">
            {desc}
          </div>
        )}
      </div>

      <button
        onClick={() => setActive(!active)}
        className={`w-11 h-6 rounded-full transition px-1 flex items-center ${
          active ? "bg-cyan-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow transition ${
            active ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
