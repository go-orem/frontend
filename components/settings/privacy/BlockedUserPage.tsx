// /privacy/BlockedUsersPage.tsx
"use client";

import { ArrowLeft, UserX } from "lucide-react";

export default function BlockedUsersPage({ onBack, data }: any) {
  const blocked = data?.blocked ?? [];

  return (
    <div className="h-full">
      <div className="p-2.5 space-y-3">
        {blocked.length === 0 && (
          <div className="text-xs  p-2.5 text-gray-400">No blocked users</div>
        )}

        {blocked.map((u: any, i: number) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg"
          >
            <UserX size={20} />
            <span className="text-sm">{u}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
