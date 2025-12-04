"use client";

import { UseFormRegister } from "react-hook-form";
import { CreateGroupType } from "./schema";
import { AvatarUploader } from "./AvatarUploader";

interface GroupBasicInfoProps {
  register: UseFormRegister<CreateGroupType>;
  avatarPreview: string | null;
  onAvatarChange: (file: File | null, preview: string | null) => void;
}

export function GroupBasicInfo({
  register,
  avatarPreview,
  onAvatarChange,
}: GroupBasicInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + Group Name in one row */}
      <div className="flex items-start gap-6">
        {/* Avatar uploader */}
        <AvatarUploader
          value={avatarPreview}
          onChange={onAvatarChange}
          size={80}
          className="shrink-0"
        />

        {/* Group name */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-sm text-gray-300">Group Name</label>
          <input
            {...register("name")}
            placeholder="e.g. Web3 Warriors"
            className="
              w-full bg-white/5 border border-white/10 rounded-xl
              px-4 py-3 outline-none text-sm
              placeholder:text-gray-500
              focus:border-[#30d5ff]/60
              transition
            "
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">Description</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe your group..."
          className="
            w-full bg-white/5 border border-white/10 rounded-xl
            px-4 py-3 outline-none text-sm resize-none
            placeholder:text-gray-500
            focus:border-[#30d5ff]/60
            transition
          "
        />
      </div>
    </div>
  );
}
