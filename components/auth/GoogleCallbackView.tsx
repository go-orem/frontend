"use client";

import { motion } from "framer-motion";
import { IconGoogle } from "../icons";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function GoogleCallbackView() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[--background] text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-800"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-gray-800 rounded-full shadow-inner">
            <IconGoogle />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold mb-2"
        >
          Logging you in...
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-sm mb-6"
        >
          Please wait while we securely sign you in with Google.
        </motion.p>

        {/* Loading Spinner */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 rounded-full border-[3px] border-gray-300 border-t-gray-700 mx-auto"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-gray-500 mt-6"
        >
          Do not close this window.
        </motion.p>
      </motion.div>
    </div>
  );
}
