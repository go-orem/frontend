"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, loading: loadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn && !loadingAuth) {
      router.push("/");
    }
  }, [isLoggedIn, loadingAuth]);

  if (loadingAuth) {
    return <div>Loading ...</div>;
  }

  return <>{children}</>;
}
