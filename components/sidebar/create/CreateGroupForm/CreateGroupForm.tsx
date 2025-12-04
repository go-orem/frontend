"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateGroupSchema, CreateGroupType } from "./schema";
import { GroupBasicInfo } from "./GroupBasicInfo";
import { CategorySelector } from "./CategorySelector";
import { TagsInput } from "./TagsInput";
import { MembersSelector } from "./MembersSelector/MembersSelector";

interface CreateGroupFormProps {
  onClose?: () => void;
}

export default function CreateGroupForm({ onClose }: CreateGroupFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const form = useForm<CreateGroupType>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      avatar: null,
      category: "General",
      categories: ["General", "Private", "Work"],
      tags: [],
      members: [],
    },
  });

  const { watch, setValue, register, handleSubmit } = form;

  const tags = watch("tags");
  const categories = watch("categories");
  const selectedCategory = watch("category");
  const members = watch("members");
  const avatar = watch("avatar");

  const [newCategory, setNewCategory] = useState("");

  const onAvatarChange = (file: File | null, preview: string | null) => {
    // simpan File-nya ke state terpisah
    setAvatarFile(file);
    setAvatarPreview(preview);

    // simpan preview ke react-hook-form (string)
    setValue("avatar", preview); // ✔ benar
  };
  // ---------- TAGS ----------
  const addTag = (t: string) => {
    if (!tags.includes(t)) {
      setValue("tags", [...tags, t]);
    }
  };

  const removeTag = (t: string) => {
    setValue(
      "tags",
      tags.filter((x) => x !== t)
    );
  };

  // ---------- MEMBERS ----------
  const toggleMember = (m: string) => {
    if (members.includes(m)) {
      setValue(
        "members",
        members.filter((x) => x !== m)
      );
    } else {
      setValue("members", [...members, m]);
    }
  };

  // ---------- SUBMIT ----------
  const onSubmit = handleSubmit((values) => {
    console.log("GROUP CREATED:", values);
    onClose?.();
  });

  return (
    <form id="create-group-form" onSubmit={onSubmit} className="space-y-6">
      {/* NAME & DESCRIPTION */}
      <GroupBasicInfo
        register={register}
        onAvatarChange={onAvatarChange}
        avatarPreview={avatarPreview}
      />

      {/* CATEGORY */}
      <CategorySelector
        selectedCategory={selectedCategory}
        categories={categories}
        onSelectCategory={(v) => setValue("category", v)}
        newCategory={newCategory}
        onNewCategoryChange={setNewCategory}
        addCategory={() => {
          const nc = newCategory.trim();
          if (!nc) return;

          const updated = [...categories, nc];
          setValue("categories", updated);
          setValue("category", nc);
          setNewCategory("");
        }}
      />

      {/* TAGS */}
      <TagsInput
        tags={tags}
        addTag={addTag}
        removeTag={removeTag}
        suggestions={["fun", "coding", "team", "private"].filter(
          (x) => !tags.includes(x)
        )}
      />

      {/* MEMBERS */}
      <MembersSelector
        members={members}
        toggleMember={toggleMember}
        allUsers={["Alice", "Bob", "Charlie", "Daisy"]}
      />
    </form>
  );
}
