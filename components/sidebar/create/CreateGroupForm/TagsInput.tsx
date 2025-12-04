"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { tagService } from "@/services/tagService";
import { getErrorMessage } from "@/utils";
import { toast } from "sonner";

interface Tag {
  id: string;
  name: string;
}

interface TagsInputProps {
  tags: Tag[];
  addTag: (tag: Tag) => void;
  removeTag: (id: string) => void;
  suggestions: Tag[];
}

export function TagsInput({
  tags,
  addTag,
  removeTag,
  suggestions,
}: TagsInputProps) {
  const [input, setInput] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  const filtered = suggestions.filter((s) =>
    s.name.toLowerCase().includes(input.toLowerCase())
  );

  const handleKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();

      const formatted = input.startsWith("#")
        ? input.trim().slice(1)
        : input.trim();

      try {
        const created = await tagService.create(formatted); // ✅ panggil backend
        addTag(created); // simpan {id, name}
      } catch (err) {
        toast.error(getErrorMessage(err));
      }

      setInput("");
      setShowSuggest(false);
    }
  };

  return (
    <div>
      <label className="block mb-1 text-sm text-gray-300">Tags</label>

      <div className="mt-2 p-4 rounded-2xl bg-white/5 border border-gray-700 backdrop-blur-xl">
        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          <AnimatePresence>
            {tags.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="px-3 py-1 rounded-full bg-green-400/20 border border-green-400 text-green-400 text-xs flex items-center gap-2 transition"
              >
                #{tag.name}
                <button onClick={() => removeTag(tag.id)}>
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggest(true);
          }}
          onKeyDown={handleKey}
          placeholder="Type #tag and press Enter"
          className="w-full bg-transparent text-white placeholder:text-gray-500 outline-none text-sm"
        />

        {/* Suggestions */}
        {showSuggest && input.trim() !== "" && filtered.length > 0 && (
          <div className="mt-3 rounded-xl bg-black/40 border border-white/10 max-h-32 overflow-auto">
            {filtered.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  addTag(t);
                  setInput("");
                  setShowSuggest(false);
                }}
                className="px-4 py-2 text-sm text-gray-300 hover:bg-white/10 cursor-pointer"
              >
                #{t.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
