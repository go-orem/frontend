"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getMe } from "@/lib/auth";

type User = {
  user: {
    id: string;
    username: string;
    email: string | null;
    is_active: boolean;
  };
  auth_identities: Array<{
    id: string;
    provider: string;
    provider_uid: string;
  }>;
  profile: {
    avatar_url: string | null;
    avatar_mime: string | null;
    background_url: string | null;
    background_mime: string | null;
    badge_url: string | null;
    badge_hover_url: string | null;
    badge_hover_mime: string | null;
    bio: string | null;
    public_name: string | null;
    show_public_name: boolean;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshing: boolean;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function refreshUser() {
    setRefreshing(true);
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    // initial load
    (async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshing,
        isLoggedIn: !!user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
