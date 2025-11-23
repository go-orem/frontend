// /privacy/LastSeenPage.tsx
"use client";

import { ArrowLeft } from "lucide-react";

export default function LastSeenPage({ onBack }: any) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-2.5 space-y-3 text-sm">
        <Option label="Everyone" />
        <Option label="My Contacts" />
        <Option label="Nobody" />

        <p className="p-2.5 text-xs font mono text-gray-400 pt-3">
          If you disable this, you won't see others’ last seen either.
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
