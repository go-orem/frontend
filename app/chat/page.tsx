"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import SplitView from "../../components/layout/MainContent";
import { useRouter } from "next/navigation";

export default function ChatPage() {
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

  return (
    <>
      <SplitView />
    </>
  );
}
