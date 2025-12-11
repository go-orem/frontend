"use client";

import React, { useState, useMemo } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { X, User, Wallet, FolderPlus, ChevronRight } from "lucide-react";
import { IconArrowRight, IconSearch, IconStorage } from "../icons";
import IconFolder from "../icons/IconFolder";

interface SidebarAccountSettingsProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function SidebarAccountSettings({
  open,
  setOpen,
}: SidebarAccountSettingsProps) {
  const [activeTab, setActiveTab] = useState<
    "account" | "blockchain" | "media"
  >("account");
  const [subPage, setSubPage] = useState<null | string>(null);

  /* =============== MEDIA STATES =============== */
  const [search, setSearch] = useState("");
  const [folders, setFolders] = useState<string[]>(["Images", "Docs", "Music"]);
  const [newFolder, setNewFolder] = useState("");

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderItems, setFolderItems] = useState<any[]>([]);

  /* =============== MEDIA ITEMS (DATA DUMMY) =============== */
  const [mediaItems, setMediaItems] = useState<any[]>([
    {
      id: "1",
      name: "Screenshot App",
      type: "image/png",
      thumbnail: "https://picsum.photos/seed/11/200/200",
      folder: "Images",
    },
    {
      id: "2",
      name: "Avatar User",
      type: "image/jpeg",
      thumbnail: "https://picsum.photos/seed/22/200/200",
      folder: "Images",
    },
    {
      id: "3",
      name: "Smart Contract PDF",
      type: "application/pdf",
      thumbnail: "https://picsum.photos/seed/33/200/200",
      folder: "Docs",
    },
    {
      id: "4",
      name: "Music Track 1",
      type: "audio/mp3",
      thumbnail: "https://picsum.photos/seed/44/200/200",
      folder: "Music",
    },
  ]);

  /* =============== FILTER SEARCH GLOBAL =============== */
  const filteredMedia = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return mediaItems;
    return mediaItems.filter((m) => m.name.toLowerCase().includes(q));
  }, [search, mediaItems]);

  /* =============== ADD FOLDER =============== */
  const addFolder = () => {
    if (!newFolder.trim()) return;
    if (folders.includes(newFolder.trim())) return;
    setFolders((prev) => [...prev, newFolder.trim()]);
    setNewFolder("");
  };

  /* =============== OPEN FOLDER PANEL =============== */
  const openFolder = (folder: string) => {
    setSelectedFolder(folder);
    setFolderItems(mediaItems.filter((m) => m.folder === folder));
  };

  /* =============== REMOVE ITEM DARI FOLDER =============== */
  const removeFromFolder = (id: string) => {
    setMediaItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, folder: null } : m))
    );
    setFolderItems((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

      <div className="fixed inset-y-0 right-0 flex">
        <DialogPanel
          className="
            w-screen max-w-sm h-full 
            shadow-xl text-gray-200 flex flex-col relative overflow-hidden
            bg-(--background)
          "
          style={{
            backgroundColor: "var(--sidebar-bg, #0E0F10)",
          }}
        >
          {/* HEADER */}
          <div className="p-4 pt-2.5 flex items-center justify-between border-b border-white/10">
            <h2 className="text-md font-semibold">
              {subPage
                ? subPage
                : activeTab === "account"
                ? "Account Settings"
                : activeTab === "blockchain"
                ? "Blockchain Settings"
                : "Media Manager"}
            </h2>

            {subPage ? (
              <button
                onClick={() => setSubPage(null)}
                className="p-2 rounded-full bg-black/40 hover:bg-(--hovercolor)"
              >
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full bg-black/40 hover:bg-(--hovercolor) cursor-pointer"
              >
                <IconArrowRight />
              </button>
            )}
          </div>

          {/* CONTENT */}
          {!subPage && (
            <>
              {/* TAB BUTTONS */}
              <div className="flex border-b border-white/10">
                <TabButton
                  active={activeTab === "account"}
                  onClick={() => setActiveTab("account")}
                  label="Account"
                />
                <TabButton
                  active={activeTab === "media"}
                  onClick={() => setActiveTab("media")}
                  label="Media"
                />
                <TabButton
                  active={activeTab === "blockchain"}
                  onClick={() => setActiveTab("blockchain")}
                  label="Blockchain"
                />
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                {/* ---------------- ACCOUNT ---------------- */}
                {activeTab === "account" && (
                  <>
                    <MenuItem
                      icon={<User size={18} />}
                      label="Edit Profile"
                      sub="Change avatar & name"
                      onClick={() => setSubPage("Edit Profile")}
                    />

                    <MenuItem
                      icon={<User size={18} />}
                      label="Account Info"
                      sub="Phone, email, ID"
                      onClick={() => setSubPage("Account Info")}
                    />
                  </>
                )}

                {/* ---------------- BLOCKCHAIN ---------------- */}
                {activeTab === "blockchain" && (
                  <>
                    <MenuItem
                      icon={<Wallet size={18} />}
                      label="Wallet Address"
                      sub="0x12...89Ef"
                      onClick={() => setSubPage("Wallet Address")}
                    />

                    <MenuItem
                      icon={<Wallet size={18} />}
                      label="On-Chain Data"
                      sub="Chat hash, identity mask"
                      onClick={() => setSubPage("On-Chain Data")}
                    />
                  </>
                )}

                {/* ---------------- MEDIA ---------------- */}
                {activeTab === "media" && (
                  <div className="p-4 space-y-6 relative">
                    {/* SEARCH */}
                    <div className="p-4 bg-black/5 border border-gray-700 rounded-2xl">
                      <label className="block mb-2 text-sm text-gray-300">
                        Search Media
                      </label>

                      <div className="relative">
                        <span className="absolute left-3 top-3">
                          <IconSearch />
                        </span>

                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search media…"
                          className="w-full bg-black/20 border border-white/10 pl-10 pr-4 py-3 rounded-xl outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* FOLDERS */}
                    <div className="p-4 bg-black/5 border border-white/10 rounded-2xl">
                      <label className="block mb-3 text-sm text-gray-300">
                        Folders
                      </label>

                      <div className="grid grid-cols-4 gap-2">
                        {folders.map((f, idx) => (
                          <div
                            key={idx}
                            onClick={() => openFolder(f)}
                            className="p-2 rounded-xl cursor-pointer flex flex-col items-center"
                          >
                            <IconFolder />
                            <span className="text-xs mt-1 text-gray-300 truncate text-center block w-full max-w-full">
                              {f}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <input
                          value={newFolder}
                          onChange={(e) => setNewFolder(e.target.value)}
                          placeholder="Folder baru…"
                          className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                        />

                        <button
                          onClick={addFolder}
                          className="p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20"
                        >
                          <FolderPlus size={18} />
                        </button>
                      </div>
                    </div>

                    {/* ============= PANEL ISI FOLDER ============= */}
                    {selectedFolder && (
                      <div className="fixed right-0 top-0 h-full w-screen max-w-sm bg-black/40 backdrop-blur-2xl border-l border-white/10 p-4 z-50 animate-slideIn">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-sm font-bold">
                            Folder: {selectedFolder}
                          </h2>

                          <button
                            onClick={() => setSelectedFolder(null)}
                            className="p-2 rounded-xl hover:bg-white/10 cursor-pointer"
                          >
                            <IconArrowRight />
                          </button>
                        </div>

                        {folderItems.length === 0 && (
                          <div className="text-xs text-gray-500">
                            Belum ada item di folder ini.
                          </div>
                        )}

                        <div className="space-y-3 max-h-[85vh] overflow-y-auto pr-2">
                          {folderItems.map((item: any) => (
                            <div
                              key={item.id}
                              className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3"
                            >
                              <img
                                src={item.thumbnail}
                                className="w-10 h-10 rounded-md object-cover"
                              />

                              <div className="flex-1">
                                <p className="text-xs text-gray-300 truncate">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                  {item.type}
                                </p>
                              </div>

                              <button
                                onClick={() => removeFromFolder(item.id)}
                                className="px-2 py-1 text-[10px] bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

/* ---------- COMPONENTS ---------- */
function TabButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-center p-3 text-sm cursor-pointer ${
        active ? "text-white border-b-2 border-green-400" : "text-gray-400"
      }`}
    >
      {label}
    </button>
  );
}

function MenuItem({ icon, label, sub, onClick }: any) {
  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div>{icon}</div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          {sub && <div className="text-xs text-gray-400">{sub}</div>}
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </div>
  );
}
