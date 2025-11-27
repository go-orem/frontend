"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { IconGoogle } from "../icons";

export default function GoogleLoginButton() {
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri:
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/google/callback`
        : undefined,
  });

  return (
    <button
      onClick={() => login()}
      className="relative z-10 w-full px-6 py-2.5 rounded-full  text-sm font-bold bg-(--background) text-white neon-border cursor-pointer"
      type="button"
    >
      <div className="flex items-center gap-3">
        <IconGoogle />
        <span>Login with Google</span>
      </div>
    </button>
  );
}
