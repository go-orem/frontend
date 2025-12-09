"use client";

import { useState } from "react";
import { userService } from "@/services/userService";
import { Profile } from "@/types/database.types";

export function useUserSearch() {
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (
    q: string,
    opts?: { limit?: number; page?: number; offset?: number }
  ) => {
    if (!q.trim()) return;

    setLoading(true);
    try {
      const data = await userService.searchUser(q, opts);
      setResults(data ?? []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}
