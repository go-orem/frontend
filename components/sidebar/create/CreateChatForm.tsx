"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils";
import { useUserSearch } from "@/hooks/useUserSearch";
import { motion, AnimatePresence } from "framer-motion";

const CreateChatSchema = z.object({
  recipient_id: z.string().uuid("Recipient ID must be valid UUID"),
});

type CreateChatType = z.infer<typeof CreateChatSchema>;

interface CreateChatFormProps {
  onClose?: () => void;
}

export default function CreateChatForm({ onClose }: CreateChatFormProps) {
  const form = useForm<CreateChatType>({
    resolver: zodResolver(CreateChatSchema),
    defaultValues: { recipient_id: "" },
  });

  const { watch, setValue, handleSubmit } = form;
  const recipientId = watch("recipient_id");

  const [searchQuery, setSearchQuery] = useState("");
  const { results: searchResults, loading, error, search } = useUserSearch();

  // ----- DEBOUNCE SEARCH -----
  const [lastQuery, setLastQuery] = useState("");

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery === lastQuery) return;

    const timeout = setTimeout(() => {
      search(searchQuery)
        .then(() => setLastQuery(searchQuery))
        .catch((err) => toast.error(getErrorMessage(err)));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // ----- SUBMIT -----
  const onSubmit = handleSubmit(async (values) => {
    console.log("CREATE CHAT:", values);
    // TODO: call chatService.createChat(values.recipient_id)
    onClose?.();
  });

  return (
    <form
      id="create-chat-form"
      onSubmit={onSubmit}
      className="flex flex-col gap-6 mt-2 px-4"
    >
      {/* Search input */}
      <div className="flex flex-col gap-2">
        <motion.label
          className="text-sm text-gray-300"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          Search Username
        </motion.label>

        <motion.input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter username..."
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="
            flex-1 bg-white/5 border border-white/10 rounded-xl
            px-4 py-3 outline-none text-sm
            placeholder:text-gray-500
            focus:border-[#30d5ff]/60
            transition
          "
        />
      </div>

      {/* Results */}
      <div className="flex flex-col gap-2">
        {loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-400"
          >
            Searching...
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
        <AnimatePresence>
          {searchResults.map((u) => (
            <motion.div
              key={u.user_id}
              onClick={() => setValue("recipient_id", u.user_id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer border
                ${
                  recipientId === u.user_id
                    ? "bg-blue-600/20 border-blue-400"
                    : "bg-white/5 border-white/10"
                }
                transition
              `}
            >
              <img
                src={
                  u.avatar_url ||
                  `https://api.dicebear.com/7.x/thumbs/svg?seed=${u.username}`
                }
                className="w-8 h-8 rounded-full border border-white/10"
              />
              <div className="flex flex-col">
                <span className="text-sm text-white">@{u.username}</span>
                <span className="text-xs text-white/50">{u.public_name}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={!recipientId}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        className="
          w-full px-4 py-3 rounded-xl btn-primary text-white text-sm
          disabled:opacity-50 transition
        "
      >
        Start Chat
      </motion.button>
    </form>
  );
}
