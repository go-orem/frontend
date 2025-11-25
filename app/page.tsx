"use client";
import { useAuth } from "@/hooks/useAuth";
import LoadingAuth from "@/components/UI/LoadingAuth";
import LandingGuest from "@/components/pages/dashboard/LandingGuest";
import Landing from "@/components/pages/dashboard/Landing";

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
