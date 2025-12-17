"use client";

import { useState } from "react";
import { IconCall, IconSearch, IconVideo } from "@/components/icons";
import { CallLauncher } from "@/components/modals";
import { HeaderChatSearch } from "@/components/UI";
import { ConversationDetail } from "@/hooks";

interface HeaderSplitProps {
  onProfileClick: () => void;
  detail: ConversationDetail;
  currentUserId: string;
}

const HeaderSplit: React.FC<HeaderSplitProps> = ({
  onProfileClick,
  detail,
  currentUserId,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  // tentukan header name
  let headerName = detail.conversation.name ?? "Unnamed";
  let profileUrl =
    detail.conversation.cover_url ?? detail.conversation.profile_url ?? "";

  if (detail.conversation.conversation_type === "direct") {
    const otherMember = detail.members.find((m) => m.user_id !== currentUserId);
    if (otherMember) {
      headerName = otherMember?.username ?? "Unknown User";
      profileUrl = otherMember?.avatar_url ?? profileUrl;
    }
  }
  if (!profileUrl) {
    profileUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${headerName}`;
  }

  return (
    <div className="header-atas w-auto h-15 p-2 pl-5.5 pr-5.5 flex justify-between border-b-[0.5px] border-gray-700 items-center bg-(--background)">
      {videoOpen && (
        <CallLauncher open={videoOpen} onClose={() => setVideoOpen(false)} />
      )}

      {searchOpen ? (
        <HeaderChatSearch onCancel={() => setSearchOpen(false)} />
      ) : (
        <>
          <div
            className="container flex space-x-3 items-center cursor-pointer"
            onClick={onProfileClick}
          >
            <div className="profile">
              <img
                className="w-10 h-10 rounded-full object-cover border-3 border-pink-400"
                src={profileUrl || "/default-avatar.png"}
                alt="Profile"
              />
            </div>
            <div>
              <div className="name text-sm font-semibold">{headerName}</div>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>

          <div className="flex space-x-6 cursor-pointer">
            <button onClick={() => setVideoOpen(true)}>
              <IconVideo />
            </button>
            <IconCall />
            <button onClick={() => setSearchOpen(true)}>
              <IconSearch />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderSplit;
