// lib/auth.ts
"use client";

export async function register(
  username: string,
  email: string,
  password: string
) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function loginGoogle(idToken: string) {
  const res = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("Google login failed");
  return res.json();
}

export async function getWeb3Nonce(address: string) {
  const res = await fetch(`/api/auth/web3/nonce?address=${address}`);
  if (!res.ok) throw new Error("Failed to get nonce");
  return res.json();
}

export async function loginWeb3(
  address: string,
  signature: string,
  nonce: string
) {
  const res = await fetch("/api/auth/web3/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature, nonce }),
  });
  if (!res.ok) throw new Error("Web3 login failed");
  return res.json();
}

export async function getMe() {
  const res = await fetch("/api/auth/me");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json(); // { id, username, email, roles, ... }
}

export async function logout() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}
