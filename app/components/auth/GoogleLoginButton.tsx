"use client";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import IconGoogle from "../icons/IconAuth/IconGoogle";

type GoogleLoginButtonProps = {
  onSuccess?: (user: any) => void;
};

export default function GoogleLoginButton({
  onSuccess,
}: GoogleLoginButtonProps) {
  const { refreshUser } = useAuth();

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const idToken = credentialResponse.credential;
            if (!idToken) throw new Error("No credential from Google");

            const res = await fetch("/api/login/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                provider: "google",
                credential: { id_token: idToken },
              }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");

            await refreshUser();
            toast.success(`Login success! Welcome ${data.user.username}`);

            if (onSuccess) onSuccess(data.user);
          } catch (err: any) {
            toast.error(`Login failed: ${err.message}`);
          }
        }}
        onError={() => toast.error("Google login failed")}
        // useOneTap
      />
    </div>
  );
}
