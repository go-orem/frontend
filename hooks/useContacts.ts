"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { Contact } from "@/types/database.types";

export function useContacts(userId: string) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await userService.listContacts(userId);
        setContacts(data ?? []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  return { contacts, loading, error };
}
