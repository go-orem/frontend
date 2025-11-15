import React from "react";
import IconSetting from "../icons/IconSetting";
import IconCall from "../icons/IconCall";
import IconChat from "../icons/IconChat";
import IconCerita from "../icons/IconCerita";

function MobileMenu() {
  const items = [
    { icon: <IconCerita />, label: "Cerita" },
    { icon: <IconCall />, label: "Panggilan" },
    { icon: <IconChat />, label: "Chat" },
    { icon: <IconSetting />, label: "Pengaturan" },
  ];

  return (
    <div>
      <ul className="flex justify-between items-center pl-8 pr-8 p-1 pb-1 border-t-[0.5px] border-gray-700 bg-[--sidebar-bg]">
        {items.map((item, i) => (
          <li key={i} className="relative group mt-1 mb-1">
            <button
              className="p-2 rounded-xl transition-colors duration-200 
                        hover:bg-gray-700/40 focus:bg-gray-700/50 cursor-pointer"
            >
              {item.icon}
            </button>
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono 
                        bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 
                        group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-999"
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MobileMenu;
