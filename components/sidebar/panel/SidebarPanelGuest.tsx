"use client";

import { GoogleLoginButton, Web3LoginButton } from "@/components/auth";
import { motion } from "framer-motion";

export default function SidebarPanelGuest() {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-full bg-[--background] border-r border-gray-800 p-6 flex flex-col text-center"
    >
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
        Akses cepat dan aman dengan akun Orem.
      </div>
    </motion.div>
  );
}
