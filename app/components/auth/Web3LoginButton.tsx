import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { getWeb3Nonce, loginWeb3 } from "@/lib/auth";
import IconMetamask from "../icons/IconAuth/IconMetamask";
import { useAuth } from "@/context/AuthContext";

type Web3LoginButtonProps = {
  onSuccess?: (user: any) => void;
};

export default function Web3LoginButton({ onSuccess }: Web3LoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  async function handleLogin() {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const { nonce } = await getWeb3Nonce(address);
      const signature = await signer.signMessage(nonce);
      const data = await loginWeb3(address, signature, nonce);

      await refreshUser();
      toast.success(`Login success! Welcome ${data.user.username}`);

      if (onSuccess) onSuccess(data);
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
        <IconMetamask />
        <span>{loading ? "Logging in..." : "Wallet"}</span>
      </div>
    </button>
  );
}
