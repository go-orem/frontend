export type WalletOption = {
  name: string;
  type: "evm" | "solana";
  provider: any;
};

export function getAvailableWallets(): WalletOption[] {
  if (typeof window === "undefined") return [];

  const wallets: WalletOption[] = [];

  if ((window as any).ethereum?.isMetaMask) {
    wallets.push({
      name: "MetaMask",
      type: "evm",
      provider: (window as any).ethereum,
    });
  }

  if ((window as any).phantom?.solana?.isPhantom) {
    wallets.push({
      name: "Phantom",
      type: "solana",
      provider: (window as any).phantom.solana,
    });
  }

  return wallets;
}
