"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getErrorMessage, importPublicKey } from "@/utils";
import { useUserSearch } from "@/hooks/useUserSearch";
import { motion, AnimatePresence } from "framer-motion";
import { ConversationsWithMemberBody } from "@/types/conversations.types";
import { useConversations } from "@/hooks/useConversations";
import { useRouter } from "next/navigation";
import {
  encryptConversationKey,
  exportRawKey,
  generateConversationKey,
} from "@/utils/crypto/conversationKey";
import { useAuth } from "@/hooks";

const CreateChatSchema = z.object({
  recipient_id: z.string().uuid("Recipient ID must be valid UUID"),
});

type CreateChatType = z.infer<typeof CreateChatSchema>;

interface CreateChatFormProps {
  onClose?: () => void;
}

export default function CreateChatForm({ onClose }: CreateChatFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const form = useForm<CreateChatType>({
    resolver: zodResolver(CreateChatSchema),
    defaultValues: { recipient_id: "" },
  });

  const { watch, setValue, handleSubmit } = form;
  const recipientId = watch("recipient_id");

  const [searchQuery, setSearchQuery] = useState("");
  const { results: searchResults, loading, error, search } = useUserSearch();

  const { createConversation } = useConversations();

  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);

  // ----- DEBOUNCE SEARCH -----
  const [lastQuery, setLastQuery] = useState("");

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery === lastQuery) return;

    const timeout = setTimeout(() => {
      search(searchQuery, {
        limit: 5,
        page: 1,
      })
        .then(() => setLastQuery(searchQuery))
        .catch((err) => toast.error(getErrorMessage(err)));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // ----- SUBMIT -----
  const onSubmit = handleSubmit(async (values) => {
    if (!user || !user.user) return;
    try {
      setLoadingCreate(true);
      console.log("CREATE CHAT:", values);
      if (!values.recipient_id) {
        toast.error("Please select a user to chat with.");
        return;
      }
      const recipient = searchResults.find(
        (u) => u.user_id === values.recipient_id
      );
      if (!recipient) {
        toast.error("Selected user not found.");
        return;
      }
      console.log("Starting chat with:", recipient);

      // 1. generate conversation key
      const conversationKey = await generateConversationKey();
      const rawKey = await exportRawKey(conversationKey);

      // 2. encrypt for recipient
      if (!recipient.active_key?.public_key) {
        throw new Error("Recipient active public key not found.");
      }
      const recipientPublicKey = await importPublicKey(
        recipient.active_key?.public_key
      );
      const encryptedForRecipient = await encryptConversationKey(
        rawKey,
        recipientPublicKey
      );

      // 3. encrypt for self
      if (!user.active_key?.public_key) {
        throw new Error("User active public key not found.");
      }
      const userPublicKey = await importPublicKey(user.active_key.public_key);
      const encryptedForSelf = await encryptConversationKey(
        rawKey,
        userPublicKey
      );

      const conversationBody: ConversationsWithMemberBody = {
        conversation: {
          conversation_type: "direct",
          is_public: false,
          name: recipient.show_public_name
            ? recipient.public_name
            : recipient.username || "Unnamed",
          profile_url: recipient.avatar_url,
        },
        members: [
          {
            user_id: recipient.user_id,
            role: "admin",
            encrypted_conversation_key: JSON.stringify(encryptedForRecipient),
            key_algo: "X25519+AES-GCM",
            key_version: 1,
          },
          {
            user_id: user.user.id,
            role: "admin",
            encrypted_conversation_key: JSON.stringify(encryptedForSelf),
            key_algo: "X25519+AES-GCM",
            key_version: 1,
          },
        ],
      };

      console.log("Conversations payload:", conversationBody);

      // TODO: call chatService.createChat(values.recipient_id)
      const res = await createConversation(conversationBody);
      console.log("Chat created:", res);
      if (!res) {
        toast.error("Failed to create chat.");
        return;
      }
      toast.success("Chat created successfully!");
      router.push(`/channel/${res.id}`);
      onClose?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingCreate(false);
    }
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          Search Username
        </motion.label>

        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative"
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            @
          </span>

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="enter username..."
            className="
              w-full bg-white/5 border border-white/10 rounded-xl
              pl-8 pr-4 py-3 outline-none text-sm
              placeholder:text-gray-500
              focus:border-[#30d5ff]/60
              transition
            "
          />
        </motion.div>
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
              transition={{
                duration: 0.3,
              }}
              whileHover={{ scale: 1.02 }}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer border
                ${
                  recipientId === u.user_id
                    ? "bg-blue-600/20 border-blue-400"
                    : "bg-white/5 border-white/10"
                }
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

          {!loading && searchResults.length === 0 && lastQuery && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-400"
            >
              No users found for "{lastQuery}".
            </motion.p>
          )}
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
          disabled:opacity-50
        "
      >
        Start Chat{" "}
        {loadingCreate ? (
          <span className="ml-2 inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
        ) : (
          ""
        )}
      </motion.button>
    </form>
  );
}
