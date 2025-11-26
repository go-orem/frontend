"use client";
import { useAuth } from "@/hooks/useAuth";
import { Landing, LandingGuest } from "@/components/pages/dashboard";
import { LoadingAuth } from "@/components/UI";

export default function HomePage() {
  const { isLoggedIn, loading: loadingAuth } = useAuth();

  if (loadingAuth) {
    return <LoadingAuth />;
  }

  if (!isLoggedIn) {
    return <LandingGuest />;
  }

  return <Landing />;
}
