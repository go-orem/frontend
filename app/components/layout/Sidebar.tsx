"use client";

import React, { useState } from "react";
import IconChat from "../icons/IconChat";
import IconChannel from "../icons/IconChannel";
import IconNotifikasi from "../icons/IconNotifikasi";
import IconGroup from "../icons/IconGroup";
import IconNearby from "../icons/IconNearby";
import IconAdd from "../icons/IconAdd";
import IconStorage from "../icons/IconStorage";
import IconMusic from "../icons/IconMusic";
import DarkModeToggle from "../UI/DarkMode";
import IconBantuan from "../icons/IconBantuan";
import IconGame from "../icons/IconGame";
import LanggananSidebar from "../UI/profile/LanggananSidebar";
import IconProfile from "../icons/IconProfile";
import Sparkles from "../UI/effects/SparklesLangganan";
import AuthSidebar from "../auth/AuthSidebar";
import IconLogout from "../icons/IconLogout";

type MenuItem = {
  icon: React.ComponentType;
  label: string;
  href: string;
};

export default function Sidebar({ onMenuClick }: { onMenuClick: (index: number) => void }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openAuth, setOpen] = useState(false);

  const menuTop: MenuItem[] = [
    { icon: IconChat, label: "Chat", href: "/chat" },
    { icon: IconNotifikasi, label: "Notifikasi", href: "/notifikasi" },
    { icon: IconChannel, label: "Channel", href: "/channel" },
    { icon: IconGroup, label: "Group", href: "/grup" },
    { icon: IconNearby, label: "Terdekat", href: "/terdekat" },
    { icon: IconAdd, label: "Tambah", href: "/tambah" },
    { icon: IconStorage, label: "Penyimpanan", href: "/penyimpanan" },
    { icon: IconMusic, label: "Musik", href: "/musik" },
    { icon: IconBantuan, label: "Bantuan", href: "/bantuan" },
    { icon: IconGame, label: "Game", href: "/game" },
  ];

  const menuBottom: MenuItem[] = [
    { icon: IconProfile, label: "User", href: "" },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isActive = activeIndex === index;
    const Icon = item.icon;

    return (
      <li
        key={index}
        onClick={() => {
          setActiveIndex(index);
          onMenuClick(index); // kirim index ke parent
        }}
        className="group relative flex items-center justify-center p-2 rounded-full hover:bg-[--hovercolor] transition-colors cursor-pointer"
      >
        <span
          className={`absolute left-0 -ml-2 w-1 bg-(--primarycolor) rounded-r-full transition-all duration-300 ease-in-out
            ${
              isActive
                ? "h-8 opacity-100"
                : "h-0 opacity-0 group-hover:h-6 group-hover:opacity-100"
            }`}
        />
        <div
          className={`transition-transform duration-200 ease-in-out ${
            isActive
              ? "scale-110 text-(--primarycolor)"
              : "group-hover:scale-110 group-hover:text-green-400"
          }`}
        >
          <Icon />
        </div>
        <span className="absolute z-999 left-14 px-1.5 py-1.5 rounded-md bg-(--hovercolor) text-white font-mono text-sm opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out pointer-events-none">
          {item.label}
        </span>
      </li>
    );
  };

  const chunkedMenu = [];
  for (let i = 0; i < menuTop.length; i += 4) {
    chunkedMenu.push(menuTop.slice(i, i + 4));
  }

  return (
    <nav className="flex flex-col p-2 items-center justify-between w-15 h-screen border-r border-gray-700">
      <ul className="space-y-2 w-full flex flex-col items-center">
        {chunkedMenu.map((group, gIndex) => (
          <React.Fragment key={gIndex}>
            {group.map((item, i) => renderMenuItem(item, gIndex * 4 + i))}
            {gIndex !== chunkedMenu.length - 1 && (
              <hr className="w-8 border-t border-gray-600 my-1" />
            )}
          </React.Fragment>
        ))}
      </ul>

      <div className="flex flex-col items-center space-y-3">
        <DarkModeToggle />
        <button
          onClick={() => setOpenSidebar(true)}
          className="relative cursor-pointer"
        >
          <img
            src="https://cuandigitalkit.com/wp-content/uploads/2025/09/subcribe.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <Sparkles count={17} areaSize={38} />
        </button>
        <LanggananSidebar
          open={openSidebar}
          onClose={() => setOpenSidebar(false)}
        />
        <button onClick={() => setOpen(true)} className="relative cursor-pointer">
          <IconLogout />
        </button>
        <AuthSidebar open={openAuth} onClose={() => setOpen(false)} />
        <ul className="space-y-2">
          {menuBottom.map((item, i) =>
            renderMenuItem(item, menuTop.length + i)
          )}
        </ul>
      </div>
    </nav>
  );
}
