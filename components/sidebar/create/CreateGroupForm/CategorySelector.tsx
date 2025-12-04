"use client";

import { ChevronDown } from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: string;
  categories: string[];
  onSelectCategory: (c: string) => void;

  newCategory: string;
  onNewCategoryChange: (v: string) => void;
  addCategory: () => void;
}

export function CategorySelector({
  selectedCategory,
  categories,
  onSelectCategory,
  newCategory,
  onNewCategoryChange,
  addCategory,
}: CategorySelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm text-gray-300">Category</label>

      {/* Dropdown */}
      <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="
            w-full appearance-none rounded-xl
            bg-white/5 border border-white/10
            text-gray-200 text-sm
            px-4 py-3
            outline-none
            focus:border-[#30d5ff]/60
            transition
          "
        >
          {categories.map((c) => (
            <option key={c} value={c} className="text-black">
              {c}
            </option>
          ))}
        </select>

        {/* Dropdown arrow */}
        <ChevronDown
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      {/* New Category Input + Add Button */}
      <div className="flex items-center gap-3">
        <input
          value={newCategory}
          onChange={(e) => onNewCategoryChange(e.target.value)}
          placeholder="New category"
          className="
            flex-1 px-4 py-3 text-sm rounded-xl outline-none
            bg-white/5 border border-white/10
            placeholder:text-gray-500
            focus:border-[#30d5ff]/60
            transition
          "
        />

        <button
          type="button"
          onClick={addCategory}
          className="
            px-4 py-2 text-sm rounded-xl
            bg-white/10 border border-white/20 text-gray-200
            hover:bg-white/20 hover:border-white/30
            transition
          "
        >
          Add
        </button>
      </div>
    </div>
  );
}
