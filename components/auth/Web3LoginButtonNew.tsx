import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { parseWeb3Error } from "@/utils";
import { getAvailableWallets, WalletOption } from "@/utils/walletDetection";
import { WalletSelectModal } from "../modals";
import { IconMetamask } from "../icons";

export default function Web3LoginButtonNew({
  onSuccess,
}: {
  onSuccess?: (user: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const [wallets, setWallets] = useState<WalletOption[]>([]);
  const { refreshUser, authService } = useAuth();

  async function handleLogin() {
    const detected = getAvailableWallets();

    if (detected.length === 0) {
      toast.error("No wallet detected");
      return;
    }

    if (detected.length === 1) {
      await handleLoginProcess(detected[0]);
      return;
    }

    setWallets(detected);
    setWalletModal(true);
  }

  async function handleLoginProcess(wallet: WalletOption) {
    setLoading(true);
    setWalletModal(false);

    try {
      if (wallet.type === "evm") {
        const provider = new ethers.BrowserProvider(wallet.provider);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const { nonce } = await authService.getWeb3Nonce(address);
        const signature = await signer.signMessage(nonce);

        const data = await authService.loginWeb3(address, signature, nonce);
        await refreshUser();
        toast.success(`Welcome ${data.user.username}`);
        onSuccess?.(data);
      }

      if (wallet.type === "solana") {
        const resp = await wallet.provider.connect();
        const address = resp.publicKey.toString();

        const { nonce } = await authService.getWeb3Nonce(address);
        const encodedMessage = new TextEncoder().encode(nonce);
        const signed = await wallet.provider.signMessage(
          encodedMessage,
          "utf8"
        );

        const data = await authService.loginWeb3(
          address,
          signed.signature,
          nonce
        );
        await refreshUser();
        toast.success(`Welcome ${data.user.username}`);
        onSuccess?.(data);
      }
    } catch (err: any) {
      console.log("err", err);
      console.log("ERR RAW:", err);
      console.log("ERR MESSAGE:", err?.message);
      console.log("ERR CODE:", err?.code);
      console.log("ERR NAME:", err?.name);
      console.log("ERR RESPONSE:", err?.response);
      console.log("ERR RESPONSE?.DATA:", err?.response?.data);

      toast.error(parseWeb3Error(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {walletModal && (
        <WalletSelectModal
          wallets={wallets}
          onSelect={handleLoginProcess}
          onClose={() => setWalletModal(false)}
        />
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="relative z-10 w-full px-6 py-2.5 rounded-full text-sm font-bold bg-(--background) text-white neon-border flex items-center gap-3"
      >
        <IconMetamask /> {loading ? "Connecting..." : "Wallet"}
      </button>
    </>
  );
}
