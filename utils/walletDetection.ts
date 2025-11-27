export type WalletOption = {
  name: string;
  type: "evm" | "solana";
  provider: any;
};

export function getAvailableWallets(): WalletOption[] {
  if (typeof window === "undefined") return [];

  const wallets: WalletOption[] = [];

  // --- EVM wallets ---
  const { ethereum } = window as any;
  if (ethereum) {
    // MetaMask
    if (ethereum.isMetaMask) {
      wallets.push({
        name: "MetaMask",
        type: "evm",
        provider: ethereum,
      });
    }

    // Coinbase Wallet
    if (ethereum.isCoinbaseWallet) {
      wallets.push({
        name: "Coinbase",
        type: "evm",
        provider: ethereum,
      });
    }

    // Brave Wallet
    if (ethereum.isBraveWallet) {
      wallets.push({
        name: "Brave",
        type: "evm",
        provider: ethereum,
      });
    }

    // Generic EVM provider (jaga-jaga kalau ada wallet lain)
    if (
      !ethereum.isMetaMask &&
      !ethereum.isCoinbaseWallet &&
      !ethereum.isBraveWallet
    ) {
      wallets.push({
        name: "Injected EVM Wallet",
        type: "evm",
        provider: ethereum,
      });
    }
  }

  // --- Solana wallets ---
  const { solana } = window as any;
  if (solana?.isPhantom) {
    wallets.push({
      name: "Phantom",
      type: "solana",
      provider: solana,
    });
  }

  if (solana?.isSolflare) {
    wallets.push({
      name: "Solflare",
      type: "solana",
      provider: solana,
    });
  }

  return wallets;
}
