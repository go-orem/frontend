"use client";

import { handleResponse } from "@/utils/response";

class AuthService {
  async register(username: string, email: string, password: string) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async loginGoogle(idToken: string) {
    const res = await fetch("/api/auth/login/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "google",
        credential: { id_token: idToken },
      }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async getWeb3Nonce(address: string) {
    const res = await fetch(`/api/auth/web3/nonce/${address}`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse(res);
  }

  async loginWeb3(address: string, signature: string, nonce: string) {
    const res = await fetch("/api/auth/web3/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, signature, nonce }),
      credentials: "include",
    });
    return handleResponse(res);
  }

  async getMe() {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });
    return handleResponse(res);
  }

  async logout() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    return handleResponse(res);
  }
}

export const authService = new AuthService();
