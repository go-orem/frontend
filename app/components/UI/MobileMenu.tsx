"use client";

import React from "react";
import IconSetting from "../icons/IconSetting";
import IconCall from "../icons/IconCall";
import IconChat from "../icons/IconChat";
import IconCerita from "../icons/IconCerita";

type MobileMenuProps = {
  onMenuClick?: (index: number) => void;
  activeIndex?: number;
  className?: string;
};

const MobileMenu: React.FC<MobileMenuProps> = ({
  onMenuClick,
  activeIndex = -1,
  className = "",
}) => {
  const items: { icon: React.ComponentType; label: string }[] = [
    { icon: IconCerita, label: "Cerita" },
    { icon: IconCall, label: "Panggilan" },
    { icon: IconChat, label: "Chat" },
    { icon: IconSetting, label: "Pengaturan" },
  ];

  return (
    <div className={className}>
      <ul className="flex justify-between items-center pl-8 pr-8 p-1 pb-1 border-t-[0.5px] border-gray-700 bg-[--sidebar-bg]">
        {items.map((item, i) => {
          const Icon = item.icon;
          const isActive = i === activeIndex;

          return (
            <li key={item.label} className="relative group mt-1 mb-1">
              <button
                type="button"
                aria-label={item.label}
                aria-pressed={isActive}
                onClick={() => onMenuClick?.(i)}
                className={`p-2 rounded-xl transition-colors duration-200 focus:outline-none
                  ${
                    isActive
                      ? "bg-[--hovercolor] scale-105"
                      : "hover:bg-(--hovercolor)"
                  }
                  cursor-pointer`}
              >
                <Icon />
              </button>

              <span
                className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono 
                        bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                        group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-99"
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default React.memo(MobileMenu);
