"use client";

import React, { useState } from "react";

export default function MutedUsersPage({ onBack }: any) {
  const [muteCalls, setMuteCalls] = useState(true);

  const muted = [
    { id: 1, name: "0xF3...91C4" },
    { id: 2, name: "0xA9...77E2" },
  ];

  return (
    <div className="p-4 text-gray-200">
      <div className="space-y-4">
        {muted.map((u) => (
          <div
            key={u.id}
            className="flex justify-between items-center p-3 bg-white/5 rounded-md"
          >
            <span className="">{u.name}</span>
            <button className="text-xs px-3 py-1 bg-red-500/20 rounded-md hover:bg-red-500/30">
              Unmute
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className=" text-sm">Mute Calls Also</div>
            <div className="text-xs text-gray-400 ">
              Prevent muted users from calling you
            </div>
          </div>
          <Toggle value={muteCalls} onChange={() => setMuteCalls(!muteCalls)} />
        </div>
      </div>
    </div>
  );
}

function Toggle({ value, onChange }: any) {
  return (
    <div
      onClick={onChange}
      className={`w-11 h-6 flex items-center rounded-full cursor-pointer transition ${
        value ? "bg-green-500" : "bg-gray-600"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition ${
          value ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </div>
  );
}
