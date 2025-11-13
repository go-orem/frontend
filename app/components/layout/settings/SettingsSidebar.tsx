"use client";
import React from "react";
import InfoSidebar from "../Info/InfoSidebar";
// import AccountSidebar from "./AccountSidebar";
// import WalletSidebar from "./WalletSidebar";
import AccountSettings from "./account/Page";
import WalletSettings from "./wallet/Page";
import WhitepaperSettings from "./whitepaper/Page";

export default function SettingSidebar({
  activeSidebar,
  data,
  onClose,
}: {
  activeSidebar: "info" | "account" | "wallet" | "whitepaper" | "setting";
  data: any;
  onClose: () => void;
}) {
  return (
    <div className="w-auto h-full border-[0.5px] border-gray-800 bg-[--background]">
      {activeSidebar === "account" && (
        <AccountSettings data={data} onClose={onClose} />
      )}
      {activeSidebar === "wallet" && (
        <WalletSettings data={data} onClose={onClose} />
      )}
      {activeSidebar === "whitepaper" && (
        <WhitepaperSettings data={data} onClose={onClose} />
      )}
    </div>
  );
}