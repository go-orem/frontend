"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Search } from "lucide-react";

// MOCK DATA — nanti ganti dengan real user dari API / blockchain
const USERS = [
  { id: "u1", name: "Satoshi", username: "@btc" },
  { id: "u2", name: "Vitalik Buterin", username: "@eth" },
  { id: "u3", name: "CZ Binance", username: "@cz" },
  { id: "u4", name: "Elon Musk", username: "@elon" },
  { id: "u5", name: "CoffeeDev", username: "@coffee" },
];

type AddMembersProps = {
  selected: string[];
  setSelected: (ids: string[]) => void;
};

export default function AddMembers({ selected, setSelected }: AddMembersProps) {
  const [query, setQuery] = useState("");

  const toggle = (id: string) => {
    if (selected.includes(id))
      setSelected(selected.filter((x) => x !== id));
    else setSelected([...selected, id]);
  };

  const filtered = USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full text-white">
      {/* SEARCH */}
      <div className="px-4 py-3 border-b border-gray-600">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-base pl-10"
            placeholder="Search users..."
          />
        </div>
      </div>

      {/* SELECTED MEMBERS */}
      {selected.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-700 bg-(--hovercolor)">
          <div className="text-xs text-gray-400 mb-2">Selected Members</div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selected.map((id) => {
                const user = USERS.find((u) => u.id === id)!;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="tag-chip"
                  >
                    {user.name}
                    <button
                      onClick={() => toggle(id)}
                      className="hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* USER LIST */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No users found.</p>
        )}

        <div className="space-y-1 p-2">
          {filtered.map((u) => (
            <div
              key={u.id}
              onClick={() => toggle(u.id)}
              className="item-hover px-4 py-3 flex justify-between items-center rounded-xl cursor-pointer border border-white/5"
            >
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-xs text-gray-500">{u.username}</div>
              </div>

              {/* CHECKBOX UI */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border
                ${selected.includes(u.id)
                  ? "bg-[#30d5ff] border-[#30d5ff]"
                  : "border-white/20"
                }`}
              >
                {selected.includes(u.id) && <Check size={14} className="text-black" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
