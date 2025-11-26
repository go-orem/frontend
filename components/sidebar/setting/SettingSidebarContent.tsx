"use client";
import {
  AccountSetting,
  PrivacySetting,
  WalletSetting,
  WhitepaperSetting,
} from "@/components/settings";

export default function SettingSidebarContent({
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
    | "settings";
  data: any;
  onClose: () => void;
}) {
  return (
    <div className="w-auto h-full border-[0.5px] border-gray-800 bg-[--background]">
      {activeSidebar === "account" && (
        <AccountSetting variant={data?.variant} data={data} onClose={onClose} />
      )}
      {activeSidebar === "wallet" && (
        <WalletSetting data={data} onClose={onClose} />
      )}
      {activeSidebar === "whitepaper" && (
        <WhitepaperSetting data={data} onClose={onClose} />
      )}
      {activeSidebar === "privacy" && (
        <PrivacySetting data={data} onClose={onClose} />
      )}
    </div>
  );
}
