"use client";
import { useContext } from "react";
import { authService } from "@/services/authService";
import { AuthContext } from "@/context";
import { deleteCookie } from "@/utils";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");

  async function login(email: string, password: string) {
    const user = await authService.login(email, password);
    await ctx!.refreshUser();
    return user;
  }

  async function register(username: string, email: string, password: string) {
    const user = await authService.register(username, email, password);
    await ctx!.refreshUser();
    return user;
  }

  async function loginGoogle(idToken: string) {
    const user = await authService.loginGoogle(idToken);
    await ctx!.refreshUser();
    return user;
  }

  async function loginWeb3(address: string, signature: string, nonce: string) {
    const user = await authService.loginWeb3(address, signature, nonce);
    await ctx!.refreshUser();
    return user;
  }

  async function logout() {
    try {
      // 1. Call backend logout API
      await authService.logout();

      // 2. Force delete cookie client-side
      deleteCookie("token");

      // 3. Small delay to ensure cookie is deleted
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 4. Refresh user state
      await ctx!.refreshUser();
    } catch (error) {
      // Even if API fails, still delete cookie and refresh
      deleteCookie("token");
      await ctx!.refreshUser();
      throw error;
    }
  }

  const isAuthenticated = !!ctx.user && !ctx.loading;

  return {
    ...ctx,
    login,
    register,
    loginGoogle,
    loginWeb3,
    logout,
    isAuthenticated,
    authService,
  };
}
