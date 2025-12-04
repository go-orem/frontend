"use client";

import { useEffect, useState } from "react";
import { tagService } from "@/services/tagService";
import { Tag } from "@/types/database.types";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await tagService.list();
      setTags(data ?? []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { tags, loading, error, setTags, refresh };
}
