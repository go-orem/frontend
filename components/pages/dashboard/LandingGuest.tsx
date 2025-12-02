"use client";

import { GoogleLoginButton, Web3LoginButton } from "@/components/auth";
import { IconGroup } from "@/components/icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LandingGuest() {
  const router = useRouter();

  const ChannelPublicButton = () => {
    return (
      <>
        <button
          onClick={() => router.push("channel-public")}
          className="relative z-10 w-full px-6 py-2.5 rounded-full  text-sm font-bold bg-(--background) text-white neon-border cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <IconGroup />
            <span className="flex flex-row flex-wrap">Grup Publik</span>
          </div>
        </button>
      </>
    );
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full bg-[--background] text-[--foreground] p-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Judul */}
      <motion.h1
        className="text-4xl font-bold text-[--primarycolor] mb-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        Decentralized chatting 💬
      </motion.h1>

      <motion.p
        className="text-gray-400 mb-8 text-center max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Communicate with a global community for decentralized chats, channels, and groups.
      </motion.p>

      {/* Tombol aksi */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <ChannelPublicButton />
        <Web3LoginButton />
        <GoogleLoginButton />
      </motion.div>
    </motion.div>
  );
}
