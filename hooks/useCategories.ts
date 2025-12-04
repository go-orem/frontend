"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/database.types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await categoryService.list();
        setCategories(data ?? []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { categories, loading, error };
}
