"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { Profile } from "@/types/database.types";

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await userService.getProfile(userId);
        setProfile(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  return { profile, loading, error };
}
