"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuth();

  return (
    <>
      <AnimatePresence>
        {loading && !!user && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-2xl font-bold"
            >
              🚀 Loading...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && children}
    </>
  );
}
