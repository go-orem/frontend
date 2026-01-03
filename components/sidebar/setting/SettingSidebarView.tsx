"use client";
import { useState } from "react";
import SettingSidebarContent from "@/components/sidebar/setting/SettingSidebarContent";
import { useAuth } from "@/hooks/useAuth";
import {
  IconArrowRight,
  IconEdit,
  IconLogout,
  IconProfile,
} from "@/components/icons";
import WalletOrem from "@/components/icons/IconWalletApp/WalletOrem";
import IconLanguage from "@/components/icons/IconSidebarSetting/IconLanguage";
import IconPrivacy from "@/components/icons/IconSidebarSetting/IconPrivacy";
import IconAppearance from "@/components/icons/IconSidebarSetting/IconAppearance";
import IconDeveloper from "@/components/icons/IconSidebarSetting/IconDeveloper";
import IconWhitepaper from "@/components/icons/IconSidebarSetting/IconWhitepaper";
import IconFolderSet from "@/components/icons/IconSidebarSetting/IconFolderSet";
import IconChatSet from "@/components/icons/IconSidebarSetting/IconChatSet";
import IconNotificationSet from "@/components/icons/IconSidebarSetting/IconNotificationSet";

const settingsMenu = [
  { name: "Account", icon: <IconProfile />, key: "account", variant: "user" },
  { name: "Wallet", icon: <WalletOrem />, key: "wallet", variant: "user" },
  { name: "Edit", icon: <IconEdit />, key: "edit", variant: "user" },
  {
    name: "Notification",
    icon: <IconNotificationSet />,
    key: "notification",
    variant: "group",
  },
  {
    name: "Privacy",
    icon: <IconPrivacy />,
    key: "privacy",
    variant: "user",
  },
  { name: "Chat", icon: <IconChatSet />, key: "chat", variant: "user" },
  { name: "Folder", icon: <IconFolderSet />, key: "folder", variant: "group" },
  {
    name: "Language",
    icon: <IconLanguage />,
    key: "language",
    variant: "user",
  },
  {
    name: "Appearance",
    icon: <IconAppearance />,
    key: "appearance",
    variant: "user",
    divider: true,
  },
  {
    name: "Whitepaper",
    icon: <IconWhitepaper />,
    key: "whitepaper",
    variant: "user",
  },
  {
    name: "Developer",
    icon: <IconDeveloper />,
    key: "developer",
    variant: "group",
  },
];

export default function SettingSidebarView() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const { user, refreshUser } = useAuth();

  const handleOpenSidebar = async (item: any) => {
    if (selectedMenu === item.key && showSidebar) {
      handleCloseSidebar();
      return;
    }

    setSelectedMenu(item.key);
    if (item.key === "account") {
      await refreshUser();
      if (user) {
        setSelectedData({
          name: user?.user?.username,
          variant: item.variant,
          avatar: user?.profile?.avatar_url || "/profile.png",
          cover: user?.profile?.background_url || "/cover-placeholder.png",
          status: "Online",
          description: `Informasi detail untuk menu ${item.name}`,
          bio: user?.profile?.bio || "Deskripsi contoh untuk user",
          members: [],
        });
      }
      setShowSidebar(true);
      return;
    }

    setSelectedData({
      name: item.name,
      variant: item.variant,
      avatar: "/profile.png",
      cover: "/cover-placeholder.png",
      status: "Online",
      description: `Informasi detail untuk menu ${item.name}`,
      bio: "Deskripsi contoh untuk user",
      members:
        item.variant === "group"
          ? [
              { id: 1, name: "User A", avatar: "/user1.png" },
              { id: 2, name: "User B", avatar: "/user2.png" },
            ]
          : [],
    });
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setTimeout(() => {
      setSelectedMenu(null);
      setSelectedData(null);
    }, 300);
  };

  return (
    <div className="relative container h-screen overflow-y-auto pl-4 pr-4">
      {/* ======= MENU SETTINGS ======= */}
      <nav>
        <ul className="align-middle justify-center items-center">
          {settingsMenu.map((item, index) => (
            <li key={index} className="flex flex-col gap-1 justify-between">
              <div
                onClick={() => handleOpenSidebar(item)}
                className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer transition-all"
              >
                <button className="flex space-x-4 items-center cursor-pointer">
                  {item.icon}
                  <span className="text-sm  font-light text-gray-400 cursor-pointer">
                    {item.name}
                  </span>
                </button>
                <span>
                  <IconArrowRight />
                </span>
              </div>

              {item.divider && (
                <span className="border-b-[0.1px] border-gray-700 mb-3 mt-2"></span>
              )}
            </li>
          ))}

          {/* Tombol keluar */}
          <li className="flex flex-col gap-1 justify-between">
            <div className="flex justify-between w-full hover:bg-(--hovercolor) p-5 rounded-xl cursor-pointer transition-all">
              <button className="flex space-x-4 items-center">
                <IconLogout />
                <span className="text-sm  font-light text-gray-400">
                  Log Out
                </span>
              </button>
            </div>
          </li>
        </ul>
      </nav>

      {/* ======= SLIDE SIDEBAR KANAN ======= */}
      {selectedMenu && (
        <div
          className={`fixed top-0 right-0 h-full w-[380px] bg-(--background) border-l border-gray-800 transition-transform duration-300 ease-in-out z-40 ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SettingSidebarContent
            activeSidebar={
              selectedMenu === "account"
                ? "account"
                : selectedMenu === "wallet"
                ? "wallet"
                : selectedMenu === "whitepaper"
                ? "whitepaper"
                : selectedMenu === "privacy"
                ? "privacy"
                : selectedMenu === "notification"
                ? "notification"
                : selectedMenu === "appearance"
                ? "appearance"
                : "info"
            }
            data={selectedData}
            onClose={handleCloseSidebar}
          />
        </div>
      )}
    </div>
  );
}
