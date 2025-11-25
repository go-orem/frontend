"use client";

import GoogleLoginButton from "@/app/components/auth/GoogleLoginButton";
import Web3LoginButton from "@/app/components/auth/Web3LoginButton";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function SidebarPanelGuest() {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-full bg-[--background] border-r border-gray-800 p-6 flex flex-col text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-6"
      >
        <LogIn className="w-12 h-12 text-[--primarycolor]" />
      </motion.div>

      {/* Message */}
      <h2 className="text-lg font-semibold mb-2 text-[--foreground]">
        Selamat Datang
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Kamu belum masuk. Login dulu untuk mulai chat, bergabung grup, atau
        mengikuti channel favoritmu.
      </p>

      {/* Call to Action */}
      <div className="space-y-3 mt-2">
        <Web3LoginButton />
        <GoogleLoginButton />
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-6 text-xs text-gray-500">
        Akses lebih cepat dan aman dengan akun Orem.
      </div>
    </motion.div>
  );
}
