"use client";

import { motion } from "framer-motion";
import Web3LoginButton from "@/app/components/auth/Web3LoginButton";
import GoogleLoginButton from "@/app/components/auth/GoogleLoginButton";

export default function LandingGuest() {
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
        Selamat Datang di Orem 🌐
      </motion.h1>

      <motion.p
        className="text-gray-400 mb-8 text-center max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Bergabunglah dengan komunitas global untuk chat, channel, dan grup. Buat
        akun atau login untuk mulai berkomunikasi dengan teman di seluruh dunia.
      </motion.p>

      {/* Tombol aksi */}
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Web3LoginButton />
        <GoogleLoginButton />
      </motion.div>
    </motion.div>
  );
}
