"use client";

import React, { useState } from "react";
import { Switch, Tab } from "@headlessui/react";
import { X } from "lucide-react";
import SidebarSharePanel from "@/app/components/UI/modal/PopupShare";
import IconAdd from "@/components/icons/IconAdd";

// ✅ Tipe props untuk komponen
interface WhitepaperSettingsProps {
  variant?: "user" | "group"; // dibuat optional supaya aman
  data: any;
  onClose: () => void;
}

// ✅ Helper className
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const WhitepaperSettings: React.FC<WhitepaperSettingsProps> = ({
  variant = "whitepaper",
  data,
  onClose,
}) => {
  const tabs = ["Overview", "Consensus", "Cryptography", "SDK"];

  const [shareOpen, setShareOpen] = useState(false);

  return (
    <aside className="relative h-full w-auto bg-[--background] text-gray-200 flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="relative">
        <div className="p-3 py-3 flex gap-3 justify-between">
          <div>
            <div className="ml-1 flex justify-center">
              <div className="flex flex-col">
                <div className="text-lg font-black font-mono">{data?.name}</div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 cursor-pointer"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 pb-6 flex-1 overflow-y-auto space-y-4">
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
                {(data?.mediaItems ?? []).map((m: any, i: number) => (
                  <img
                    key={i}
                    src={m.src}
                    alt={m.alt ?? `media-${i}`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                ))}
                {(data?.mediaItems ?? []).length === 0 && (
                  <div className="text-xs text-gray-500 col-span-3">media</div>
                )}
              </div>
            </Tab.Panel>

            {/* FILES */}
            <Tab.Panel>
              <ul className="space-y-2 font-mono">
                {(data?.files ?? []).map((f: string, i: number) => (
                  <li key={i} className="p-2 bg-[#121212] rounded-md text-xs">
                    {f}
                  </li>
                ))}
                {(data?.files ?? []).length === 0 && (
                  <div className="text-xs text-gray-500">Tidak ada file</div>
                )}
              </ul>
            </Tab.Panel>

            {/* VOICE */}
            <Tab.Panel>
              <ul className="space-y-2 font-mono">
                {(data?.voice ?? []).map((v: string, i: number) => (
                  <li key={i} className="p-2 bg-[#121212] rounded-md text-xs">
                    🎙️ {v}
                  </li>
                ))}
                {(data?.voice ?? []).length === 0 && (
                  <div className="text-xs text-gray-500">Tidak ada voice</div>
                )}
              </ul>
            </Tab.Panel>

            {/* LINKS */}
            <Tab.Panel>
              <ul className="space-y-2 font-mono">
                {(data?.links ?? []).map((l: string, i: number) => (
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
                {(data?.links ?? []).length === 0 && (
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
      <div className="py-1 w-full border-t-[0.5px] border-gray-700">
        <div className="flex items-center gap-3">
          <button className="flex-1 py-2 rounded-md hover:bg-[#151515] flex items-center justify-center gap-2 cursor-pointer">
            <IconAdd />
            <span className="text-sm font-mono text-gray-300">Tanya team</span>
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

export default WhitepaperSettings;
