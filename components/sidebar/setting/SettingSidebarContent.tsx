"use client";
import {
  AccountSetting,
  NotificationSetting,
  PrivacySetting,
  WalletSetting,
  WhitepaperSetting,
} from "@/components/settings";
import AppearanceSetting from "@/components/settings/appearace/AppearanceSetting";

export default function SettingSidebarContent({
  activeSidebar,
  data,
  onClose,
}: {
  activeSidebar:
    | "info"
    | "account"
    | "wallet"
    | "notification"
    | "appearance"
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
      {activeSidebar == "notification" && (
        <NotificationSetting data={data} onClose={onClose} />
      )}
      {activeSidebar == "appearance" && (
        <AppearanceSetting data={data} onClose={onClose} />
      )}
    </div>
  );
}
