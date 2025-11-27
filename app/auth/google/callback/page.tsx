"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function GoogleCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();

  const hasRedirected = useRef(false);
  const hasRun = useRef(false);
  const code = params.get("code");

  useEffect(() => {
    if (!code && !hasRedirected.current) {
      hasRedirected.current = true;
      toast.error("Invalid google code");
      router.replace("/");
    }
  }, [code, router]);

  useEffect(() => {
    if (!code || hasRun.current) return;
    hasRun.current = true;

    const handleGoogleLogin = async () => {
      try {
        const res = await fetch("/api/auth/login/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            provider: "google",
            credential: { code },
          }),
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error?.message || "Google Login Failed");

        await refreshUser();
        toast.success(`Welcome, ${data.data.user.username}`);
        router.replace("/");
      } catch (err: any) {
        toast.error(err.message);
        router.push("/");
      }
    };

    handleGoogleLogin();
  }, [code, router, refreshUser]);

  return <p>Logging you in...</p>;
}
