"use client";
import React from "react";
import AccountSettings from "./account/Page";
import WalletSettings from "./wallet/Page";
import WhitepaperSettings from "./whitepaper/Page";
import PrivacySettings from "./privacy/Page";

export default function SettingSidebar({
  activeSidebar,
  data,
  onClose,
}: {
  activeSidebar:
    | "info"
    | "account"
    | "wallet"
    | "whitepaper"
    | "privacy"
    | "setting";
  data: any;
  onClose: () => void;
}) {
  return (
    <div className="w-auto h-full border-[0.5px] border-gray-800 bg-[--background]">
      {activeSidebar === "account" && (
        <AccountSettings
          variant={data?.variant}
          data={data}
          onClose={onClose}
        />
      )}
      {activeSidebar === "wallet" && (
        <WalletSettings data={data} onClose={onClose} />
      )}
      {activeSidebar === "whitepaper" && (
        <WhitepaperSettings data={data} onClose={onClose} />
      )}
      {activeSidebar === "privacy" && (
        <PrivacySettings data={data} onClose={onClose} />
      )}
    </div>
  );
}
