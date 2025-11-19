"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import IconGoogle from "../icons/IconAuth/IconGoogle";

type GoogleLoginButtonProps = {
  onSuccess?: (user: any) => void;
};

export default function GoogleLoginButton({
  onSuccess,
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // implicit flow → access_token
        const res = await fetch("/api/login/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "google",
            credential: { id_token: tokenResponse.access_token },
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        await refreshUser();
        toast.success(`Login success! Welcome ${data.user.username}`);

        if (onSuccess) onSuccess(data.user);
      } catch (err: any) {
        toast.error(`Login failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google login failed"),
    flow: "implicit", // bisa diganti "auth-code" untuk backend yang tukar code → token
  });

  return (
    <button
      onClick={() => login()}
      disabled={loading}
      className="relative z-10 w-full px-6 py-2.5 rounded-full font-mono text-sm font-bold bg-(--background) text-white neon-border cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <IconGoogle />
        <span>{loading ? "Logging in..." : "Google"}</span>
      </div>
    </button>
  );
}
