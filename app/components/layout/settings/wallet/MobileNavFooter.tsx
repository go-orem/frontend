import IconCall from "@/app/components/icons/IconCall";
import IconChannel from "@/app/components/icons/IconChannel";
import IconNewChat from "@/app/components/icons/IconNewChat";
import IconSet from "@/app/components/icons/IconSet";
import React from "react";

type MobileNavFooter = { icon: React.ComponentType; label?: string };

function MobileNavFooter() {
  const items = [
    { icon: <IconNewChat />, label: "Cerita" },
    { icon: <IconCall />, label: "Panggilan" },
    { icon: <IconChannel />, label: "Chat" },
    { icon: <IconSet />, label: "Pengaturan" },
  ];

  return (
    <div className="fixed bottom-0 pl-8 pr-8 p-1 left-0 right-0 z-50 backdrop-blur-xl bg-[--background] border-t-[0.5px] border-gray-700">
      <div className="flex justify-between">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              className="p-2 text-[#30d5ff] opacity-80 hover:opacity-100 transition flex flex-col items-center"
            >
              {item.icon && <span className="text-xs mt-1">{item.icon}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MobileNavFooter;
