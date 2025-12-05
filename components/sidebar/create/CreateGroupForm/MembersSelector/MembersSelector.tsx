import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { MemberItem } from "./MemberItem";
import { IconAdd, IconSearch } from "@/components/icons";

interface MemberLite {
  id: string;
  name: string;
  username: string;
  avatar_url?: string | null;
}

interface MembersSelectorProps {
  members: string[];
  allUsers: MemberLite[];
  toggleMember: (u: string) => void;
  loading?: boolean;
}

export function MembersSelector({
  members,
  allUsers,
  toggleMember,
  loading,
}: MembersSelectorProps) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div>
      <label className="block mb-1 text-sm text-gray-300">Members</label>

      {/* Chips */}
      <div className="flex flex-wrap gap-3 mt-3 py-1">
        {members.map((m) => {
          const user = allUsers.find((u) => u.id === m);
          return (
            <div
              key={m}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl 
                bg-white/5 border border-white/10 backdrop-blur-xl
                hover:border-[#30d5ff]/40 transition whitespace-nowrap"
            >
              <img
                src={
                  user?.avatar_url ||
                  `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.name}`
                }
                className="w-6 h-6 rounded-lg border border-white/10"
              />
              <span className="text-sm font-medium text-white capitalize">
                {user?.name ?? m}
              </span>

              <button
                onClick={() => toggleMember(m)}
                className="w-6 h-6 flex items-center justify-center rounded-md 
                  bg-white/5 border border-white/10 hover:bg-red-500/20 
                  hover:border-red-400 transition"
              >
                <X size={14} className="text-red-300" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Members */}
      {showAddMember ? null : (
        <button
          type="button"
          onClick={() => setShowAddMember(true)}
          className="mt-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 
          text-sm hover:bg-white/10 flex items-center gap-2 cursor-pointer"
        >
          <IconAdd />
          Add Members
        </button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showAddMember && (
          <div className="mt-3 p-4 bg-[--background] border border-gray-600 rounded-2xl backdrop-blur-xl">
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

            {/* Member List */}
            {loading ? (
              <p className="text-sm text-gray-400 mt-2">Loading contacts...</p>
            ) : (
              filteredUsers.map((u) => (
                <MemberItem
                  key={u.id}
                  name={u.name}
                  username={u.username}
                  avatar_url={u.avatar_url}
                  isSelected={members.includes(u.id)}
                  onToggle={() => toggleMember(u.id)}
                />
              ))
            )}

            <button
              type="button"
              onClick={() => setShowAddMember(false)}
              className="mt-3 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 
                text-sm hover:bg-white/20 cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
