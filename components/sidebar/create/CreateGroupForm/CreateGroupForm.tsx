"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateGroupSchema, CreateGroupType } from "./schema";
import { GroupBasicInfo } from "./GroupBasicInfo";
import { CategorySelector } from "./CategorySelector";
import { TagsInput } from "./TagsInput";
import { MembersSelector } from "./MembersSelector/MembersSelector";
import { useCategories } from "@/hooks/useCategories";
import { categoryService } from "@/services/categoryService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils";
import { useTags } from "@/hooks/useTags";
import { Tag } from "@/types/database.types";

interface CreateGroupFormProps {
  onClose?: () => void;
}

type TagLite = Omit<Tag, "created_at" | "updated_at">;

export default function CreateGroupForm({ onClose }: CreateGroupFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { categories: serverCategories, loading: loadingCategories } =
    useCategories();
  const {
    tags: serverTags,
    loading: loadingTags,
    setTags: setServerTags,
  } = useTags();

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [tags, setTags] = useState<TagLite[]>([]);

  const form = useForm<CreateGroupType>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      avatar: null,
      category_id: "",
      tags: [],
      members: [],
    },
  });

  const { watch, setValue, register, handleSubmit } = form;

  useEffect(() => {
    if (!loadingCategories) {
      setCategories(serverCategories);
      if (serverCategories.length > 0) {
        const generalCat = serverCategories.find(
          (v) => v.name.toLowerCase() == "general"
        );
        if (generalCat) {
          setValue("category_id", generalCat.id);
        } else {
          setValue("category_id", serverCategories[0].id);
        }
      }
    }
  }, [serverCategories, loadingCategories, setValue]);

  const selectedCategory = watch("category_id");
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
  const addTag = async (t: { id: string; name: string }) => {
    // simpan object di UI state
    if (!tags.find((x) => x.id === t.id)) {
      setTags([...tags, t]);
    }
    // simpan ID di form state
    const currentIds = watch("tags");
    if (!currentIds.includes(t.id)) {
      setValue("tags", [...currentIds, t.id]);
    }

    if (!serverTags.find((x) => x.id === t.id)) {
      setServerTags([
        ...serverTags,
        {
          ...t,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    }
  };

  const removeTag = (id: string) => {
    setTags(tags.filter((x) => x.id !== id));
    setValue(
      "tags",
      watch("tags").filter((x) => x !== id)
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

  const addCategory = async () => {
    const nc = newCategory.trim();
    if (!nc) return;

    try {
      const created = await categoryService.create(nc);
      setCategories([...categories, created]);
      setValue("category_id", created.id);
      setNewCategory("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

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
        selectedCategoryId={selectedCategory}
        categories={categories}
        onSelectCategory={(v) => setValue("category_id", v)}
        newCategory={newCategory}
        onNewCategoryChange={setNewCategory}
        addCategory={addCategory}
      />

      {/* TAGS */}
      <TagsInput
        tags={tags}
        addTag={addTag}
        removeTag={removeTag}
        suggestions={serverTags.filter((x) => !tags.find((t) => t.id === x.id))}
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
