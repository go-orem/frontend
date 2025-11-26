"use client";
import { useContext } from "react";
import { authService } from "@/services/authService";
import { AuthContext } from "@/context";

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
    await authService.logout();
    await ctx!.refreshUser();
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
