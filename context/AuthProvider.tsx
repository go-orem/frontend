"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authService } from "@/services/authService";
import {
  getPrivateKey,
  generateUserKeyPair,
  savePrivateKey,
  exportPublicKey,
} from "@/utils";
import { FullUser } from "@/types/database.types";

type AuthContextType = {
  user: FullUser | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
  forceLogout: (reason?: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🔐 Ensure user has keypair
   * - private key: IndexedDB
   * - public key: backend
   */
  async function ensureUserKey(me: FullUser) {
    if (typeof window === "undefined" || !me.user) return; // safety check

    const userId = me.user.id;
    const existingPrivateKey = await getPrivateKey(userId);
    if (existingPrivateKey) return;

    const keyPair = await generateUserKeyPair();
    await savePrivateKey(userId, keyPair.privateKey);

    const publicKey = await exportPublicKey(keyPair.publicKey);

    await authService.registerPublicKey({
      publicKey,
      algo: "ECDH-P256",
      version: 1,
    });

    refreshUser();
  }

  async function refreshUser() {
    setRefreshing(true);
    try {
      const me = await authService.getMe();
      await ensureUserKey(me);
      setUser(me);
      setError(null);
    } catch (err: any) {
      setUser(null);
      setError(err.message || "Failed to refresh user");
    } finally {
      setRefreshing(false);
    }
  }

  async function forceLogout(reason?: string) {
    setUser(null);
    setError(reason || "Unauthorized");
  }

  useEffect(() => {
    // initial load
    (async () => {
      try {
        const me = await authService.getMe();
        await ensureUserKey(me);
        setUser(me);
        setError(null);
      } catch (err: any) {
        setUser(null);
        setError(err.message || "Failed to fetch user");
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
        error,
        isLoggedIn: !!user,
        refreshUser,
        forceLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
