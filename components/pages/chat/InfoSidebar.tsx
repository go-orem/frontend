"use client";

import { useState } from "react";
import { Switch, Tab } from "@headlessui/react";
import { X } from "lucide-react";
import {
  IconBisu,
  IconCall,
  IconChat,
  IconEdit,
  IconEnkripsi,
  IconGear,
  IconStar,
  IconSubcribe,
  IconVideo,
} from "@/components/icons";
import { PopupShare } from "@/components/modals";
import { useGift, useModal } from "@/context";
import { MemberList, ProfileAvatar } from "@/components/UI";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function InfoSidebar({
  variant,
  data,
  onClose,
}: {
  variant: "user" | "group";
  data: any;
  onClose: () => void;
}) {
  const tabs = ["Media", "Files", "Voice", "Links"];

  const [enabled, setEnabled] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Fitur edit contact
  const [isEditing, setIsEditing] = useState(false);
  const [contactName, setContactName] = useState(data.name);
  const [contactDescription, setContactDescription] = useState(
    variant === "user" ? data.bio : data.description
  );

  const { setOpenGift } = useGift();
  const { openModal } = useModal();

  const handleSaveContact = () => {
    // Simpan ke backend / context jika perlu
    setIsEditing(false);
  };

  return (
    <aside className="relative max-w-md h-full w-auto bg-(--background) text-gray-200 flex flex-col overflow-hidden">
      {/* header / cover */}
      <div className="relative">
        {"cover" in data && data.cover ? (
          <img
            src={data.cover}
            alt="cover"
            className="w-full h-44 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-linear-to-r from-[#0f1724] to-[#0b1220]" />
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 cursor-pointer"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>

        <div className="p-3 py-3 flex gap-3 justify-between">
          <div>
            <div className="-mt-8 flex">
              <ProfileAvatar
                src={
                  variant === "user"
                    ? data.avatar
                    : data.cover ?? "/group-placeholder.png"
                }
              />
            </div>
            <div className="ml-1 flex justify-center">
              <div className="flex flex-col">
                <div className="text-lg font-black ">{contactName}</div>
                <div className="text-xs text-gray-400 ">
                  {variant === "user"
                    ? data.status ?? "Online"
                    : `${(data.members ?? []).length} anggota`}
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              className="p-2 rounded-full hover:bg-(--hovercolor) cursor-pointer"
              onClick={() => setIsEditing(!isEditing)}
            >
              <IconEdit />
            </button>
          </div>
        </div>

        {/* Form Edit Contact */}
        {isEditing && (
          <div className="p-3 bg-[#1a1a1a] rounded-md space-y-3 mx-3 mb-3">
            <div>
              <label className="text-xs text-gray-400">Nama</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">
                {variant === "user" ? "Bio" : "Deskripsi"}
              </label>
              <textarea
                value={contactDescription}
                onChange={(e) => setContactDescription(e.target.value)}
                rows={3}
                className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white text-sm focus:outline-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-700 rounded-md text-xs hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContact}
                className="px-3 py-1 bg-blue-600 rounded-md text-xs hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* body */}
      <div className="px-4 pb-6 flex-1 overflow-y-auto space-y-4">
        {/* intro / bio / description */}
        <div>
          <p className="text-[0.775rem]  text-gray-300">{contactDescription}</p>
        </div>

        {/* actions */}
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

        {/* group members preview */}
        {variant === "group" && (
          <div>
            <h3 className="text-sm  mb-2">Anggota</h3>
            <MemberList members={data.members ?? []} />
          </div>
        )}

        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex justify-center space-x-2 w-full">
            {tabs.map((t) => (
              <Tab
                key={t}
                className={({ selected }) =>
                  classNames(
                    "px-4 py-2 text-sm  cursor-pointer rounded-full transition-all duration-200 w-auto text-center",
                    "focus:outline-none focus:ring-0 border-0 outline-none ring-0",
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
              <div className="grid grid-cols-3 gap-2 ">
                {(data.mediaItems ?? []).map((m: any, i: number) => (
                  <img
                    key={i}
                    src={m.src}
                    alt={m.alt ?? `media-${i}`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                ))}
                {(data.mediaItems ?? []).length === 0 && (
                  <div className="text-xs text-gray-500 col-span-3">
                    Tidak ada media
                  </div>
                )}
              </div>
            </Tab.Panel>

            {/* FILES */}
            <Tab.Panel>
              <ul className="space-y-2 ">
                {(data.files ?? []).map((f: string, i: number) => (
                  <li key={i} className="p-2 bg-[#121212] rounded-md text-xs">
                    {f}
                  </li>
                ))}
                {(data.files ?? []).length === 0 && (
                  <div className="text-xs text-gray-500">Tidak ada file</div>
                )}
              </ul>
            </Tab.Panel>

            {/* VOICE */}
            <Tab.Panel>
              <ul className="space-y-2 ">
                {(data.voice ?? []).map((v: string, i: number) => (
                  <li key={i} className="p-2 bg-[#121212] rounded-md text-xs">
                    🎙️ {v}
                  </li>
                ))}
                {(data.voice ?? []).length === 0 && (
                  <div className="text-xs text-gray-500">Tidak ada voice</div>
                )}
              </ul>
            </Tab.Panel>

            {/* LINKS */}
            <Tab.Panel>
              <ul className="space-y-2 ">
                {(data.links ?? []).map((l: string, i: number) => (
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
                {(data.links ?? []).length === 0 && (
                  <div className="text-xs  text-gray-500">Tidak ada link</div>
                )}
              </ul>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Notifikasi */}
        <div className="mt-4 space-y-2  text-sm">
          <div className="flex w-full items-center justify-between gap-3 text-gray-300 rounded-md py-2">
            <div className="flex items-center gap-3">
              <IconBisu />
              <span>Bisukan notifikasi</span>
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
          <div className="flex w-full items-center justify-between gap-3 text-gray-300 rounded-md py-2 cursor-pointer">
            <div className="flex items-center gap-3">
              <IconStar />
              <span>Like chat</span>
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-3 text-gray-300 rounded-md py-2 cursor-pointer">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <IconEnkripsi />
                <span>Enkripsi end to end</span>
              </div>
              <div className="pt-2">
                <span className="text-xs text-gray-500">
                  Encrypt end to end, Orem Network
                  <br /> pelajari selengkapnya
                </span>
              </div>
            </div>
          </div>
          <button className="w-full text-red-500 text-xs bg-[#111111] rounded-md py-2 hover:bg-[#1a1a1a] cursor-pointer">
            Blokir {contactName}
          </button>
          <button className="w-full text-red-500 text-xs bg-[#111111] rounded-md py-2 hover:bg-[#1a1a1a] cursor-pointer">
            Report {contactName}
          </button>
          <button className="w-full text-red-500 text-xs bg-[#111111] rounded-md py-2 hover:bg-[#1a1a1a] cursor-pointer">
            Hapus chat
          </button>
        </div>
      </div>

      {/* footer quick actions */}
      <div className="px-4 py-1 border-t-[0.5px] border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenGift(true)}
            className="flex-1 py-2 rounded-md hover:bg-[#151515] flex items-center justify-center gap-2 cursor-pointer"
          >
            <IconSubcribe />{" "}
            <span className="text-sm  text-gray-300">Kirim Hadiah</span>
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="p-2 cursor-pointer rounded-full hover:bg-(--hovercolor)"
          >
            <IconGear />
          </button>
          <PopupShare
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
}
