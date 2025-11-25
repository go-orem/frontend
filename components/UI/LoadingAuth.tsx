"use client";

import { motion } from "framer-motion";

export default function LoadingAuth() {
  return (
    <motion.div
      className="flex items-center justify-center h-full bg-[--background]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="rounded-full h-16 w-16 border-t-4 border-[--primarycolor] border-solid"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />
      <motion.span
        className="ml-4 text-[--foreground]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Memeriksa sesi...
      </motion.span>
    </motion.div>
  );
}
