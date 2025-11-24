// /privacy/ForwardingPage.tsx
"use client";

import { ArrowLeft } from "lucide-react";

export default function ForwardingPage({ onBack }: any) {
  return (
    <div className="h-full">
      <div className="p-2.5 space-y-3 text-sm">
        <Option label="Everyone" />
        <Option label="My Contacts" />
        <Option label="Nobody" />

        <p className="text-xs p-2.5 font-mono text-gray-400 pt-3">
          People won’t be able to link forwarded messages to your account.
        </p>
      </div>
    </div>
  );
}

function Option({ label }: { label: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
      {label}
    </div>
  );
}
