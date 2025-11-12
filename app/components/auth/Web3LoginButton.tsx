"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner"; // import toaster
import IconWallet from "../icons/IconWallet";
import { getWeb3Nonce, loginWeb3 } from "@/lib/auth";

export default function Web3LoginButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      // connect ke wallet
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // 1. Ambil nonce via lib
      const { nonce } = await getWeb3Nonce(address);

      // 2. Sign nonce
      const signature = await signer.signMessage(nonce);

      // 3. Login via lib
      const data = await loginWeb3(address, signature, nonce);

      // token otomatis diset di cookie oleh proxy route
      toast.success(`Login success! Welcome ${data.user.username}`);
    } catch (err: any) {
      toast.error(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="relative z-10 w-full px-6 py-2.5 rounded-full font-mono text-sm font-bold bg-(--background) text-white neon-border cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <IconWallet />
        <span>{loading ? "Logging in..." : "Wallet"}</span>
      </div>
    </button>
  );
}
