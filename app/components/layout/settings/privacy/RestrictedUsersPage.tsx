"use client";

import React from "react";

export default function RestrictedUsersPage({ onBack }: any) {
  const restricted = [
    { id: 1, name: "0xD8...55B9", reason: "Cannot view your profile" },
    { id: 2, name: "0x98...A21F", reason: "Cannot see last active" },
  ];

  return (
    <div className="p-4 text-gray-200">
      <div className="space-y-4">
        {restricted.map((u) => (
          <div
            key={u.id}
            className="p-3 bg-white/5 rounded-md flex justify-between items-center"
          >
            <div>
              <div className="font-mono text-sm">{u.name}</div>
              <div className="text-xs text-gray-400">{u.reason}</div>
            </div>

            <button className="text-xs px-3 py-1 bg-blue-500/20 rounded-md hover:bg-blue-500/30">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
