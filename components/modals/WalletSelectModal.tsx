"use client";

import { WalletOption } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowRight, IconMetamask, IconPhantom } from "../icons";
import { JSX } from "react";

type Props = {
  wallets: WalletOption[];
  onSelect: (wallet: WalletOption) => void;
  onClose: () => void;
};

export default function WalletSelectModal({
  wallets,
  onSelect,
  onClose,
}: Props) {
  const walletIcons: Record<string, JSX.Element> = {
    MetaMask: <IconMetamask />,
    Phantom: <IconPhantom />,
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Klik area luar untuk close
      >
        <motion.div
          className="bg-white dark:bg-(--background) rounded-2xl shadow-xl p-6 w-full max-w-sm
                     border border-gray-200 dark:border-gray-800 relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()} // Supaya klik di dalam tidak close
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Connect Wallet</h3>
              <span className="text-xs text-gray-500">
                Connected secure login 🔐
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer"
            >
              <IconArrowRight />
            </button>
          </div>

          {/* Wallet Options */}
          <div className="space-y-2">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => onSelect(wallet)}
                className="w-full flex items-center justify-between px-4 py-3 
                           rounded-xl border border-gray-200 dark:border-gray-700 
                           hover:bg-gray-50 dark:hover:bg-gray-800 
                           transition-all duration-200 hover:shadow-sm 
                           active:scale-[0.98] group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {walletIcons[wallet.name] ?? null}
                  <span className="font-medium">{wallet.name}</span>
                </div>

                <span className="opacity-0 group-hover:opacity-100 text-sm text-gray-500 transition-all">
                  Connect →
                </span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <button
            onClick={onClose}
            className="mt-4 w-full text-sm text-gray-500 hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
