"use client";

import React, { useEffect, useState } from "react";
import { Switch, Tab } from "@headlessui/react";
import { X } from "lucide-react";
import MemberList from "@/app/components/UI/view/MemberList";
import { useModal } from "@/app/components/UI/modal/ModalContext";
import { useGift } from "@/app/components/UI/modal/GiftContext";
import SidebarSharePanel from "@/app/components/UI/modal/PopupShare";
import AnimeBadgeAvatar from "@/app/components/UI/profile/ProfileAvatar";
import { toast } from "sonner";
import Web3LoginButton from "@/components/auth/Web3LoginButton";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { useAuth } from "@/hooks/useAuth";
import {
  IconAdd,
  IconBisu,
  IconCall,
  IconChat,
  IconEdit,
  IconEnkripsi,
  IconGear,
  IconLogout,
  IconVideo,
} from "@/components/icons";

// ✅ Tipe props untuk komponen
interface AccountSettingsProps {
  variant?: "user" | "group"; // dibuat optional supaya aman
  data: any;
  onClose: () => void;
}

// ✅ Helper className
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  variant = "account",
  data,
  onClose,
}) => {
  const tabs = ["Love", "Momen", "Jakarta", "etc"];
  const [userData, setUserData] = useState<any>(data);
  const [enabled, setEnabled] = useState(false);
  const [visibilityEnabled, setVisibilityEnabled] = useState(false);
  const { refreshUser, isLoggedIn, user, logout } = useAuth();

  const [shareOpen, setShareOpen] = useState(false);

  const { setOpenGift } = useGift();
  const { openModal } = useModal();

  // handle logout
  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
      refreshUser();
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    // merge data setelah login
    setUserData((prevData: any) => ({
      ...prevData,
      ...{
        name: user?.user?.username,
        avatar: user?.profile?.avatar_url || "/profile.png",
        cover: user?.profile?.background_url || "/cover-placeholder.png",
        status: "Online",
        bio: user?.profile?.bio || "Deskripsi contoh untuk user",
        members: [],
      },
    }));
  }, [user]);

  // close button right top sidebar
  const closeButton = (
    <button
      onClick={onClose}
      className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 cursor-pointer"
      aria-label="Close sidebar"
    >
      <X size={18} />
    </button>
  );

  if (!isLoggedIn) {
    return (
      <>
        <aside className="relative h-full w-auto bg-[--background] text-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 flex-1 flex flex-col items-center justify-center">
            {closeButton}
            <h2 className="text-lg font-mono mb-2">You are not logged in</h2>
            <p className="text-sm text-gray-400 mb-4">
              Please log in to access account settings.
            </p>
            <Web3LoginButton />
            <div className="py-1"></div>
            <GoogleLoginButton />
          </div>
        </aside>
      </>
    );
  }

  return (
    <aside className="relative h-full w-auto bg-[--background] text-gray-200 flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="relative">
        {userData?.cover ? (
          <img
            src={userData.cover}
            alt="cover"
            className="w-full h-44 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-linear-to-r from-[#0f1724] to-[#0b1220]" />
        )}

        {closeButton}

        <div className="p-3 py-3 flex gap-3 justify-between">
          <div>
            <div className="-mt-8 flex">
              <AnimeBadgeAvatar
                src={
                  variant === "user"
                    ? userData?.avatar
                    : userData?.cover ?? "/group-placeholder.png"
                }
              />
            </div>
            <div className="ml-1 flex justify-center">
              <div className="flex flex-col">
                <div className="text-lg font-black font-mono">
                  {userData?.name}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400 font-mono">
                    {variant === "user"
                      ? userData?.status ?? "Online"
                      : `${(userData?.members ?? []).length} anggota`}
                  </div>
                  <span className="text-sm text-gray-400 font-mono">
                    <strong>#</strong>syarifa💖
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button className="p-2 rounded-full hover:bg-[--hovercolor] cursor-pointer">
              <IconEdit />
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 pb-6 flex-1 overflow-y-auto space-y-4">
        {/* BIO */}
        <div>
          <p className="text-[0.775rem] font-mono text-gray-300">
            {variant === "user" ? userData?.bio : userData?.description}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          <button className="flex-1 py-2 rounded-md bg-[#161616] hover:bg-[#1e1e1e] flex items-center justify-center gap-2 text-sm cursor-pointer">
            <IconChat />
          </button>
          <button className="p-2 rounded-md bg-[#161616] hover:bg-[#1e1e1e] cursor-pointer">
            <IconVideo />
          </button>
          <button className="p-2 rounded-md bg-[#161616] hover:bg-[#1e1e1e] cursor-pointer">
            <IconCall />
          </button>
        </div>

        {/* GROUP MEMBER */}
        {variant === "group" && (
          <div>
            <h3 className="text-sm font-mono mb-2">Anggota</h3>
            <MemberList members={userData?.members ?? []} />
          </div>
        )}

        {/* NOTIFIKASI */}
        <div className="mt-4 space-y-2 font-mono text-sm">
          <div className="flex w-full items-center justify-between gap-3 text-gray-300 rounded-md py-2">
            <div className="flex items-center gap-3">
              <IconBisu />
              <span>Notification security</span>
            </div>

            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${
                enabled ? "bg-green-500" : "bg-gray-700"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer`}
            >
              <span
                className={`${
                  enabled ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
              />
            </Switch>
          </div>

          <div className="col">
            <div className="flex w-full items-center justify-between gap-3 text-gray-300 rounded-md py-2">
              <div className="flex items-center gap-3">
                <IconBisu />
                <span>Visibility akun</span>
              </div>

              <Switch
                checked={visibilityEnabled}
                onChange={setVisibilityEnabled}
                className={`${
                  visibilityEnabled ? "bg-green-500" : "bg-gray-700"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer`}
              >
                <span
                  className={`${
                    visibilityEnabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
                />
              </Switch>
            </div>

            <div>
              <span className="text-xs text-gray-500">
                public or private you can change public or private
              </span>
            </div>
          </div>

          <div className="flex flex-col text-gray-300 rounded-md py-2 cursor-pointer">
            <div className="flex items-center gap-3">
              <IconEnkripsi />
              <span>Enkripsi end to end</span>
            </div>
            <div className="pt-2">
              <span className="text-xs text-gray-500">
                Pesan dienkripsi end-to-end,
                <br /> pelajari selengkapnya
              </span>
            </div>
          </div>

          <div className="flex flex-col text-gray-300 rounded-md py-2 cursor-pointer">
            <div className="flex items-center gap-3">
              <IconEnkripsi />
              <span>Public key</span>
            </div>
            <div className="pt-2">
              <span className="text-xs text-gray-500">
                public key di gunakan untuk login atau restore backup data
              </span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <Tab.Group>
          <Tab.List className="flex space-x-2 w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {tabs.map((t) => (
              <Tab
                key={t}
                className={({ selected }) =>
                  classNames(
                    "px-4 py-2 text-sm font-mono cursor-pointer rounded-full transition-all duration-200 w-auto text-center focus:outline-none",
                    selected
                      ? "bg-(--hovercolor) text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  )
                }
              >
                {t}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="px-0 mt-3">
            {/* MEDIA */}
            <Tab.Panel>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {(userData?.mediaItems ?? []).map((m: any, i: number) => (
                  <img
                    key={i}
                    src={m.src}
                    alt={m.alt ?? `media-${i}`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                ))}
                {(userData?.mediaItems ?? []).length === 0 && (
                  <div className="text-xs text-gray-500 col-span-3">
                    Tidak ada media
                  </div>
                )}
              </div>
            </Tab.Panel>

            {/* FILES */}
            <Tab.Panel>
              <ul className="space-y-2 font-mono">
                {(userData?.files ?? []).map((f: string, i: number) => (
                  <li key={i} className="p-2 bg-[#121212] rounded-md text-xs">
                    {f}
                  </li>
                ))}
                {(userData?.files ?? []).length === 0 && (
                  <div className="text-xs text-gray-500">Tidak ada file</div>
                )}
              </ul>
            </Tab.Panel>

            {/* VOICE */}
            <Tab.Panel>
              <ul className="space-y-2 font-mono">
                {(userData?.voice ?? []).map((v: string, i: number) => (
                  <li key={i} className="p-2 bg-[#121212] rounded-md text-xs">
                    🎙️ {v}
                  </li>
                ))}
                {(userData?.voice ?? []).length === 0 && (
                  <div className="text-xs text-gray-500">Tidak ada voice</div>
                )}
              </ul>
            </Tab.Panel>

            {/* LINKS */}
            <Tab.Panel>
              <ul className="space-y-2 font-mono">
                {(userData?.links ?? []).map((l: string, i: number) => (
                  <li key={i} className="p-2 bg-[#121212] rounded-md text-xs">
                    <a
                      href={l}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {l}
                    </a>
                  </li>
                ))}
                {(userData?.links ?? []).length === 0 && (
                  <div className="text-xs font-mono text-gray-500">
                    Tidak ada link
                  </div>
                )}
              </ul>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* FOOTER */}
      <div className="px-4 py-1 border-t-[0.5px] border-gray-700">
        <div className="flex items-center gap-3">
          <button className="flex-1 py-2 rounded-md hover:bg-[#151515] flex items-center justify-center gap-2 cursor-pointer">
            <IconAdd />
            <span className="text-sm font-mono text-gray-300">Tambah akun</span>
          </button>
          <button
            onClick={() => handleLogout()}
            className="flex-1 py-2 rounded-md hover:bg-[#151515] flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconLogout />
            <span className="text-sm font-mono text-gray-300">Log Out</span>
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="p-2 cursor-pointer rounded-full hover:bg-[--hovercolor]"
          >
            <IconGear />
          </button>
          <SidebarSharePanel
            open={shareOpen}
            setOpen={setShareOpen}
            url="https://bloop.id"
            title="Bloop.id"
            description="Kamu bisa bagikan link kamu disini ☺️"
          />
        </div>
      </div>
    </aside>
  );
};

export default AccountSettings;
