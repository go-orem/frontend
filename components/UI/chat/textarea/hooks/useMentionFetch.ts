// useMentionFetch.ts
import { useState, useCallback } from "react";

export function useMentionFetch(fetchFn: (q:string)=>Promise<{id:string;name:string;avatar?:string}[]>) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const fetch = useCallback(async (q:string) => {
    setLoading(true);
    try {
      const res = await fetchFn(q);
      setItems(res);
      return res;
    } finally { setLoading(false); }
  }, [fetchFn]);

  return { loading, items, fetch };
}
