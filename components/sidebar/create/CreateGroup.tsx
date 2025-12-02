"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X, Upload } from "lucide-react";
import { IconAdd, IconSearch } from "@/components/icons";
import { Switch } from "@headlessui/react";

type CreateGroupProps = { onClose?: () => void };

const PRESET_TAGS = [
  "web3",
  "crypto",
  "nft",
  "gaming",
  "ai",
  "blockchain",
  "defi",
  "design",
  "javascript",
  "solidity",
  "nextjs",
];

const PRESET_CATEGORIES = [
  "General",
  "Technology",
  "Community",
  "Education",
  "Entertainment",
];

const ALL_USERS = [
  "alice",
  "bob",
  "charlie",
  "david",
  "emma",
  "frank",
  "gita",
  "hans",
  "indra",
  "joko",
];

export default function CreateGroup({ onClose }: CreateGroupProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isPrivate, setIsPrivate] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [members, setMembers] = useState<string[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filteredUsers =
    memberSearch.trim().length === 0
      ? ALL_USERS
      : ALL_USERS.filter((u) =>
          u.toLowerCase().includes(memberSearch.toLowerCase())
        );

  const toggleMember = (username: string) => {
    if (members.includes(username)) {
      setMembers(members.filter((m) => m !== username));
      if (openDropdown === username) setOpenDropdown(null);
    } else {
      setMembers([...members, username]);
      setOpenDropdown(username);
    }
  };

  // AVATAR
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleAvatar = (f: File | null) => {
    if (!f) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  // TAG SYSTEM
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const addTag = (value: string) => {
    const clean = value.replace("#", "").trim();
    if (!clean || tags.includes(clean)) return;

    setTags([...tags, clean]);
    setTagInput("");
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const tagSuggestions = PRESET_TAGS.filter(
    (t) =>
      t.toLowerCase().includes(tagInput.toLowerCase().replace("#", "")) &&
      !tags.includes(t)
  );

  const onTagKey = (e: any) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // CATEGORY
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const categories = [...PRESET_CATEGORIES, ...customCategories];

  const addCategory = () => {
    const clean = newCategory.trim();
    if (!clean) return;
    if (!customCategories.includes(clean))
      setCustomCategories([...customCategories, clean]);

    setSelectedCategory(clean);
    setNewCategory("");
  };

  // TOKEN GATING
  const [isTokenGate, setIsTokenGate] = useState(false);
  const [tokenType, setTokenType] = useState("O-21");
  const [tokenAddress, setTokenAddress] = useState("");
  const [minBalance, setMinBalance] = useState("");
  const [nftTokenId, setNftTokenId] = useState("");

  const handleCreate = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onClose?.();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[--background] text-white">
      <div className="flex-1 overflow-y-auto p-3 space-y-5 relative">
        {/* ==================== AVATAR ==================== */}
        <div className="flex items-start gap-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer shrink-0 w-20 h-20 rounded-full overflow-hidden border border-white/10 bg-black/40 hover:border-(--primarycolor) transition flex items-center justify-center"
          >
            {avatarPreview ? (
              <img src={avatarPreview} className="w-full h-full object-cover" />
            ) : (
              <Upload className="text-gray-500" size={20} />
            )}
          </motion.div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatar(e.target.files?.[0] ?? null)}
          />

          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-300">
              Group Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#30d5ff]/60"
              placeholder="e.g. Web3 Warriors"
            />
          </div>
        </div>

        {/* ==================== DESCRIPTION ==================== */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your group..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-[#30d5ff]/60"
          />
        </div>

        {/* ==================== CATEGORY ==================== */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Category</label>

          <div className="space-y-3">
            {/* Select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 appearance-none outline-none text-sm focus:border-[#30d5ff]/60"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <ChevronDown
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Add custom category */}
            <div className="flex gap-3">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#30d5ff]/60"
              />

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addCategory}
                className="px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-sm hover:bg-white/20 transition"
              >
                Add
              </motion.button>
            </div>
          </div>
        </div>

        {/* ==================== TAGS ==================== */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Tags</label>

          <div className="mt-2 p-4 rounded-2xl bg-white/5 border border-gray-700 backdrop-blur-xl">
            {/* Chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              <AnimatePresence>
                {tags.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="px-3 py-1 rounded-full bg-green-400/20 border border-green-400 text-green-400 text-xs flex items-center gap-2 transition"
                  >
                    #{tag}
                    <button onClick={() => removeTag(tag)}>
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input */}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKey}
              placeholder="Type #tag and press Enter"
              className="w-full bg-transparent text-white placeholder:text-gray-500 outline-none text-sm"
            />

            {/* Suggestions */}
            {tagInput && tagSuggestions.length > 0 && (
              <div className="mt-3 rounded-xl bg-black/40 border border-white/10 max-h-32 overflow-auto">
                {tagSuggestions.map((t) => (
                  <div
                    key={t}
                    onClick={() => addTag(t)}
                    className="px-4 py-2 text-sm text-gray-300 hover:bg-white/10 cursor-pointer"
                  >
                    #{t}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================== GROUP TYPE ==================== */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Group Type</label>

          <div className="space-y-3 mt-2">
            {/* Private */}
            <div className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-xl">
              <div>
                <div className="font-medium text-sm">Private Group</div>
                <p className="text-xs text-gray-400">Invite only</p>
              </div>

              <Switch
                checked={isPrivate}
                onChange={setIsPrivate}
                className={`${
                  isPrivate ? "bg-[#30d5ff]" : "bg-white/10"
                } inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer`}
              >
                <span
                  className={`${
                    isPrivate ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            {/* Paid */}
            <div className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-xl">
              <div>
                <div className="font-medium text-sm">Paid Group</div>
                <p className="text-xs text-gray-400">Pay to join</p>
              </div>

              <Switch
                checked={isPaid}
                onChange={setIsPaid}
                className={`${
                  isPaid ? "bg-green-400" : "bg-white/10"
                } inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer`}
              >
                <span
                  className={`${
                    isPaid ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </div>

        {/* ==================== PRICE ==================== */}
        {isPaid && (
          <div>
            <label className="block mb-1 text-sm text-gray-300">Price</label>

            <div className="flex gap-3 mt-2">
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#30d5ff]/60"
              />

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm appearance-none focus:border-[#30d5ff]/60"
              >
                <option>USD</option>
                <option>IDR</option>
                <option>EUR</option>
              </select>
            </div>
          </div>
        )}

        {/* ==================== TOKEN GATING ==================== */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">
            Token Gating
          </label>

          <div className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-xl mt-2">
            <div>
              <div className="font-medium text-sm">Enable Token Gating</div>
              <p className="text-xs text-gray-400">
                Only wallets with required tokens can join
              </p>
            </div>

            <Switch
              checked={isTokenGate}
              onChange={setIsTokenGate}
              className={`${
                isTokenGate ? "bg-[#30d5ff]" : "bg-white/10"
              } inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer`}
            >
              <span
                className={`${
                  isTokenGate ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>

          {isTokenGate && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-4 rounded-2xl bg-white/5 border border-gray-700 backdrop-blur-xl space-y-4"
            >
              <div>
                <label className="block mb-1 text-sm text-gray-300">
                  Token Type
                </label>

                <div className="relative">
                  <select
                    value={tokenType}
                    onChange={(e) => setTokenType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm appearance-none focus:border-[#30d5ff]/60"
                  >
                    <option value="O-21">O-21</option>
                    <option value="nft">NFT</option>
                    <option value="sbt">SBT</option>
                  </select>

                  <ChevronDown
                    size={20}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-300">
                  Contract Address
                </label>
                <input
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#30d5ff]/60"
                />
              </div>

              {tokenType === "O-21" && (
                <div>
                  <label className="block mb-1 text-sm text-gray-300">
                    Minimum Balance
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minBalance}
                    onChange={(e) => setMinBalance(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#30d5ff]/60"
                  />
                </div>
              )}

              {tokenType === "nft" && (
                <div>
                  <label className="block mb-1 text-sm text-gray-300">
                    Required Token ID
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={nftTokenId}
                    onChange={(e) => setNftTokenId(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm focus:border-[#30d5ff]/60"
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* ==================== MEMBERS ==================== */}
        <div>
          <label className="block mb-1 text-sm text-gray-300">Members</label>

          {/* Chips */}
          <div className="flex flex-wrap gap-3 mt-3 py-1">
            {members.map((m) => (
              <div
                key={m}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl 
                 bg-white/5 border border-white/10 backdrop-blur-xl
                 hover:border-[#30d5ff]/40 transition whitespace-nowrap"
              >
                {/* Avatar */}
                <img
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${m}`}
                  className="w-6 h-6 rounded-lg border border-white/10"
                />

                {/* Username */}
                <span className="text-sm font-medium text-white capitalize">
                  {m}
                </span>

                <span className="text-xs text-gray-400">@{m}</span>

                {/* Remove button */}
                <button
                  onClick={() => toggleMember(m)}
                  className="w-6 h-6 flex items-center justify-center rounded-md 
                  bg-white/5 border border-white/10 hover:bg-red-500/20 
                  hover:border-red-400 transition"
                >
                  <X size={14} className="text-red-300" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Members Button */}
          <button
            onClick={() => setShowAddMember(true)}
            className="mt-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-sm hover:bg-white/10 flex items-center gap-2 cursor-pointer"
          >
            <IconAdd />
            Add Members
          </button>

          {/* MEMBERS MODAL */}
          <AnimatePresence>
            {showAddMember && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-3 p-4 bg-[--background] border border-gray-600 rounded-2xl backdrop-blur-xl relative z-30"
              >
                {/* Search */}
                <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-white/10">
                  <IconSearch />
                  <input
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search username..."
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>

                {/* Member list */}
                {filteredUsers.map((u) => (
                  <motion.div
                    key={u}
                    whileHover={{ scale: 1.02 }}
                    className="relative group cursor-pointer p-3 mb-2 mt-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#30d5ff]/40 flex items-center gap-4 transition backdrop-blur-xl"
                  >
                    {/* Klik avatar + nama = add member */}
                    <div
                      className="flex items-center gap-4 flex-1"
                      onClick={() => toggleMember(u)}
                    >
                      <div className="relative w-10 h-10 shrink-0">
                        <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#30d5ff] transition">
                          <img
                            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${u}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-black/60" />
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold text-sm capitalize">
                          {u}
                        </div>
                        <div className="text-xs text-gray-400">@{u}</div>
                      </div>
                    </div>

                    {/* tombol dropdown — tidak trigger toggleMember */}
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === u ? null : u);
                      }}
                    >
                      {members.includes(u) ? (
                        <Check size={18} className="text-[#30d5ff]" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Done */}
                <button
                  onClick={() => setShowAddMember(false)}
                  className="mt-3 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-sm hover:bg-white/20 cursor-pointer"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
