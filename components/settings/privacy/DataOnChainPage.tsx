"use client";

import React, { useState } from "react";

export default function DataOnChainPage({ onBack }: any) {
  const [showAddress, setShowAddress] = useState(true);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [allowIndexing, setAllowIndexing] = useState(false);

  return (
    <div className="p-4 text-gray-200">
      <div className="space-y-5">
        {/* SHOW WALLET ADDRESS */}
        <SectionToggle
          title="Show Wallet Address"
          subtitle="Allow others to see your Orem wallet address"
          value={showAddress}
          onChange={() => setShowAddress(!showAddress)}
        />

        {/* SHOW PUBLIC KEY */}
        <SectionToggle
          title="Show Public Key"
          subtitle="Public key used for encrypted chat"
          value={showPublicKey}
          onChange={() => setShowPublicKey(!showPublicKey)}
        />

        {/* INDEX ON CHAIN */}
        <SectionToggle
          title="Allow Indexing"
          subtitle="Make your profile searchable on-chain"
          value={allowIndexing}
          onChange={() => setAllowIndexing(!allowIndexing)}
        />
      </div>
    </div>
  );
}

function SectionToggle({ title, subtitle, value, onChange }: any) {
  return (
    <div className="p-4 bg-white/5 rounded-lg flex justify-between items-center">
      <div>
        <div className=" text-sm">{title}</div>
        <div className="text-xs text-gray-400 ">{subtitle}</div>
      </div>
      <Toggle value={value} onChange={onChange} />
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
