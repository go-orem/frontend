"use client";

import React from "react";

export default function ActiveSessionsPage({ onBack }: any) {
  const sessions = [
    { id: 1, device: "Chrome - macOS", lastActive: "Just now" },
    { id: 2, device: "Mobile Safari - iOS", lastActive: "2 hours ago" },
  ];

  return (
    <div className="p-4 text-gray-200">

      <div className="space-y-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="p-3 bg-white/5 rounded-md flex justify-between items-center"
          >
            <div>
              <div className="font-mono text-sm">{s.device}</div>
              <div className="text-xs text-gray-400 font-mono">
                {s.lastActive}
              </div>
            </div>

            <button className="text-xs px-3 py-1 bg-red-500/20 rounded-md hover:bg-red-500/30">
              Logout
            </button>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 p-3 text-sm bg-red-500/20 rounded-lg hover:bg-red-500/30 font-mono">
        Logout All Devices
      </button>
    </div>
  );
}
