"use client";
import { useAuth } from "@/hooks/useAuth";
import LoadingAuth from "@/components/UI/LoadingAuth";
import { Landing, LandingGuest } from "@/components/pages/dashboard";

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
