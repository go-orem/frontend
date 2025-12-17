"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  X,
  User,
  Wallet,
  FolderPlus,
  ChevronRight,
  Star,
  Trash2,
  Edit2,
  Folder,
  MoreHorizontal,
} from "lucide-react";
import { IconArrowRight, IconSearch, IconStorage } from "../icons";
import IconFolder from "../icons/IconFolder";

interface SidebarAccountSettingsProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

type MediaItem = {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  folder: string | null;
};

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
  const [folders, setFolders] = useState<string[]>([
    "Images",
    "Docs",
    "Music",
    "Projects",
  ]);
  const [newFolder, setNewFolder] = useState("");

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderItems, setFolderItems] = useState<MediaItem[]>([]);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    folder: string;
  } | null>(null);

  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"all" | "favorites">("all");

  // touch/double tap detection
  const lastTapRef = useRef<Record<string, number>>({});

  /* =============== MEDIA ITEMS (DATA DUMMY) =============== */
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
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
    {
      id: "5",
      name: "Design Mockup",
      type: "image/png",
      thumbnail: "https://picsum.photos/seed/55/200/200",
      folder: "Projects",
    },
  ]);

  /* =============== EFFECTS =============== */
  // close context menu on outside click
  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // When selectedFolder changes, compute items
  useEffect(() => {
    if (!selectedFolder) {
      setFolderItems([]);
      return;
    }
    setFolderItems(mediaItems.filter((m) => m.folder === selectedFolder));
  }, [selectedFolder, mediaItems]);

  /* =============== FILTER SEARCH GLOBAL =============== */
  const filteredFolders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const source = folders.filter((f) =>
      f.toLowerCase().includes(q === "" ? "" : q)
    );
    if (viewMode === "favorites") {
      return source.filter((f) => favorites[f]);
    }
    return source;
  }, [search, folders, favorites, viewMode]);

  const filteredMedia = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return mediaItems;
    return mediaItems.filter((m) => m.name.toLowerCase().includes(q));
  }, [search, mediaItems]);

  /* =============== HELPERS =============== */
  const addFolder = () => {
    const name = newFolder.trim();
    if (!name) return;
    if (folders.includes(name)) {
      setNewFolder("");
      return;
    }
    setFolders((prev) => [...prev, name]);
    setNewFolder("");
  };

  const renameFolder = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    // prevent duplicate name by suffixing with -1 if collision
    let final = trimmed;
    if (folders.some((f) => f === trimmed && f !== oldName)) {
      let i = 1;
      while (folders.some((f) => f === `${trimmed}-${i}`)) i++;
      final = `${trimmed}-${i}`;
    }
    setFolders((prev) => prev.map((f) => (f === oldName ? final : f)));
    // move media items
    setMediaItems((prev) =>
      prev.map((m) => (m.folder === oldName ? { ...m, folder: final } : m))
    );
    // transfer favorite flag
    setFavorites((prev) => {
      const newFav = { ...prev };
      if (prev[oldName]) {
        newFav[final] = true;
      }
      delete newFav[oldName];
      return newFav;
    });

    if (selectedFolder === oldName) {
      setSelectedFolder(final);
    }
  };

  const deleteFolder = (name: string) => {
    // Remove folder, set items' folder to null (ungrouped)
    setFolders((prev) => prev.filter((f) => f !== name));
    setMediaItems((prev) =>
      prev.map((m) => (m.folder === name ? { ...m, folder: null } : m))
    );
    setFavorites((prev) => {
      const cp = { ...prev };
      delete cp[name];
      return cp;
    });
    if (selectedFolder === name) setSelectedFolder(null);
  };

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const openFolder = (folder: string) => {
    setSelectedFolder(folder);
    setFolderItems(mediaItems.filter((m) => m.folder === folder));
  };

  const removeFromFolder = (id: string) => {
    setMediaItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, folder: null } : m))
    );
    setFolderItems((prev) => prev.filter((m) => m.id !== id));
  };

  /* =============== UI INTERACTIONS =============== */
  const onFolderClick = (e: React.MouseEvent, f: string) => {
    // single click selects (we'll just open on double click)
    // we prevent default focus stealing
    e.stopPropagation();
  };

  const onFolderDoubleClick = (f: string) => {
    openFolder(f);
  };

  const onFolderContextMenu = (e: React.MouseEvent, f: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, folder: f });
  };

  // touch double-tap detection
  const onFolderTouch = (f: string) => {
    const now = Date.now();
    const last = lastTapRef.current[f] || 0;
    if (now - last < 350) {
      // consider double-tap
      openFolder(f);
      lastTapRef.current[f] = 0;
    } else {
      lastTapRef.current[f] = now;
      // set a brief timeout to clear single-tap selection (not used here)
      setTimeout(() => {
        lastTapRef.current[f] = 0;
      }, 400);
    }
  };

  /* =============== RENDER =============== */
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

      <div className="fixed inset-y-0 right-0 flex">
        <DialogPanel
          className="
            w-screen max-w-md h-full 
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
              <div className="flex pb-3">
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

              <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-4">
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
                  <div className="space-y-4">
                    {/* =============== SEARCH + FILTER =============== */}
                    <div className="flex gap-3 items-center">
                      <div className="flex-1 border-gray-700 rounded-2xl">
                        <div className="relative">
                          <span className="absolute left-4 top-3">
                            <IconSearch />
                          </span>

                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search folders or media…"
                            className="w-full bg-black/20 border border-white/10 pl-10 pr-4 py-3 rounded-full outline-none focus:border-(--primarycolor) text-sm"
                          />
                        </div>
                      </div>

                      {/* All / Favorites toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewMode("all")}
                          className={`px-3 py-2 rounded-xl text-sm cursor-pointer ${
                            viewMode === "all"
                              ? "bg-(--primarycolor)/20 text-(--primarycolor)"
                              : "bg-black/20 text-gray-300"
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setViewMode("favorites")}
                          className={`px-3 py-2 rounded-xl text-sm flex items-center gap-2 cursor-pointer ${
                            viewMode === "favorites"
                              ? "bg-(--primarycolor)/20 text-(--primarycolor)"
                              : "bg-black/20 text-gray-300"
                          }`}
                        >
                          <Star size={14} />
                          Fav
                        </button>
                      </div>
                    </div>

                    {/* ================= FOLDERS ================= */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm text-gray-300">
                          Folders
                        </label>
                        <div className="text-xs text-gray-400">
                          {filteredFolders.length} shown
                        </div>
                      </div>

                      {/* GRID */}
                      <div className="grid grid-cols-4 gap-3">
                        {filteredFolders.map((f, idx) => (
                          <div
                            key={f + idx}
                            onClick={(e) => onFolderClick(e as any, f)}
                            onDoubleClick={() => onFolderDoubleClick(f)}
                            onContextMenu={(e) =>
                              onFolderContextMenu(e as any, f)
                            }
                            onTouchStart={() => onFolderTouch(f)}
                            className="p-3 rounded-xl cursor-pointer flex flex-col items-start relative transition"
                          >
                            <div className="w-full flex items-start justify-between">
                              <div className="flex flex-col items-start gap-2">
                                <div className="rounded-xl bg-black/10">
                                  <IconFolder />
                                </div>
                                <div className="flex flex-col">
                                  {editingFolder === f ? (
                                    <input
                                      value={editingValue}
                                      onChange={(e) =>
                                        setEditingValue(e.target.value)
                                      }
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          renameFolder(f, editingValue);
                                          setEditingFolder(null);
                                        }
                                        if (e.key === "Escape") {
                                          setEditingFolder(null);
                                        }
                                      }}
                                      onBlur={() => {
                                        renameFolder(f, editingValue);
                                        setEditingFolder(null);
                                      }}
                                      className="text-sm font-medium px-1 py-0.5 bg-transparent w-36 outline-none"
                                    />
                                  ) : (
                                    <span className="text-sm font-medium truncate w-36">
                                      {f}
                                    </span>
                                  )}

                                  <span className="text-[11px] text-gray-400">
                                    {
                                      mediaItems.filter((m) => m.folder === f)
                                        .length
                                    }{" "}
                                    items
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-end">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(f);
                                  }}
                                  className="p-1 rounded-md hover:bg-white/5"
                                  title={
                                    favorites[f] ? "Unfavorite" : "Favorite"
                                  }
                                ></button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setContextMenu({
                                      x: (e as any).clientX,
                                      y: (e as any).clientY,
                                      folder: f,
                                    });
                                  }}
                                  className="p-1 rounded-md hover:bg-white/5"
                                ></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* CONTEXT MENU */}
                      {contextMenu && (
                        <div
                          className="fixed bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl py-2 w-44 z-50"
                          style={{
                            top: contextMenu.y,
                            left: contextMenu.x,
                          }}
                        >
                          <button
                            onClick={() => {
                              openFolder(contextMenu.folder);
                              setContextMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2"
                          >
                            <Folder size={14} /> Open
                          </button>

                          <button
                            onClick={() => {
                              setEditingFolder(contextMenu.folder);
                              setEditingValue(contextMenu.folder);
                              setContextMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2"
                          >
                            <Edit2 size={14} /> Rename
                          </button>

                          <button
                            onClick={() => {
                              toggleFavorite(contextMenu.folder);
                              setContextMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2"
                          >
                            <Star size={14} />{" "}
                            {favorites[contextMenu.folder]
                              ? "Unfavorite"
                              : "Favorite"}
                          </button>

                          <button
                            onClick={() => {
                              // confirm delete
                              const ok = confirm(
                                `Delete folder "${contextMenu.folder}"? This will ungroup its items.`
                              );
                              if (ok) deleteFolder(contextMenu.folder);
                              setContextMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 flex items-center gap-2 text-red-400"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ============= PANEL ISI FOLDER ============= */}
                    {selectedFolder && (
                      <div className="fixed right-0 top-0 h-full w-screen max-w-md bg-black/40 backdrop-blur-2xl border-l border-white/10 p-4 z-50 animate-slideIn">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-black/10">
                              <IconFolder />
                            </div>
                            <div>
                              <h2 className="text-sm font-bold">
                                Folder: {selectedFolder}
                              </h2>
                              <div className="text-xs text-gray-400">
                                {folderItems.length} item(s)
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedFolder(null)}
                              className="p-2 rounded-xl hover:bg-white/10 cursor-pointer"
                            >
                              <IconArrowRight />
                            </button>
                          </div>
                        </div>

                        {folderItems.length === 0 && (
                          <div className="text-xs text-gray-500">
                            Belum ada item di folder ini.
                          </div>
                        )}

                        <div className="space-y-3 max-h-[78vh] overflow-y-auto pr-2">
                          {folderItems.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3"
                            >
                              <img
                                src={item.thumbnail}
                                className="w-12 h-12 rounded-md object-cover"
                                alt={item.name}
                              />

                              <div className="flex-1">
                                <p className="text-sm text-gray-300 truncate">
                                  {item.name}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  {item.type}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => removeFromFolder(item.id)}
                                  className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                                >
                                  Remove
                                </button>
                              </div>
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
      className="group relative flex-1 flex items-center justify-center pb-2 pt-3 cursor-pointer select-none"
    >
      <span
        className={`text-sm transition-colors duration-200 ${
          active
            ? "text-(--primarycolor)"
            : "text-gray-400 group-hover:text-(--primarycolor)"
        }`}
      >
        {label}
      </span>

      {/* underline */}
      <span
        className={`absolute -bottom-0.5 h-1 rounded-full bg-(--primarycolor) transition-all duration-300 ease-in-out
          ${
            active
              ? "w-10 opacity-100"
              : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
          }
        `}
      />
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
