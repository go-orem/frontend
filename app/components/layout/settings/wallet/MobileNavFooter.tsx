import AppOrem from "@/app/components/icons/IconWallet/AppOrem";
import HistoryOrem from "@/app/components/icons/IconWallet/HistoryOrem";
import RewardOrem from "@/app/components/icons/IconWallet/RewardOrem";
import WalletOrem from "@/app/components/icons/IconWallet/WalletOrem";
import React from "react";

type MobileNavFooter = { icon: React.ComponentType; label?: string };

function MobileNavFooter() {
  const items = [
    { icon: <WalletOrem />, label: "Wallet" },
    { icon: <RewardOrem />, label: "Reward" },
    { icon: <HistoryOrem />, label: "History" },
    { icon: <AppOrem />, label: "Apps" },
  ];

  return (
    <div className="fixed bottom-0 pl-8 pr-8 p-1 left-0 right-0 z-50 backdrop-blur-xl bg-[--background] border-t-[0.5px] border-gray-700">
      <div className="flex justify-between">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              className="p-2 text-gray-300 opacity-80 hover:opacity-100 transition flex flex-col items-center cursor-pointer"
            >
              {item.icon && <span className="text-xs mt-1 mb-1">{item.icon}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MobileNavFooter;
