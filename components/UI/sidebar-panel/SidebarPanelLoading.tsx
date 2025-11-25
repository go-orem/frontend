"use client";

import { motion } from "framer-motion";

export default function SidebarPanelLoading() {
  const skeletonItems = Array(6).fill(0);

  return (
    <div className="h-full bg-[--background] border-r border-gray-800 p-4 flex flex-col animate-fade">
      {/* Header Placeholder */}
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="h-10 w-32 bg-gray-700 rounded-md mb-6"
      />

      {/* Menu Placeholder */}
      <div className="space-y-4">
        {skeletonItems.map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="h-8 w-8 bg-gray-700 rounded-md" />
            <div className="flex-1 h-6 bg-gray-700 rounded-md" />
          </motion.div>
        ))}
      </div>

      {/* Footer info / profile placeholder */}
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="mt-auto pt-6 flex items-center space-x-3"
      >
        <div className="h-10 w-10 rounded-full bg-gray-700" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-700 rounded-md mb-2" />
          <div className="h-4 w-16 bg-gray-700 rounded-md" />
        </div>
      </motion.div>
    </div>
  );
}
