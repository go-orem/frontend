"use client";

import { useState } from "react";

interface EditContactFormProps {
  variant: "user" | "group";
  initialName: string;
  initialDescription: string;
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
}

export default function EditContactForm({
  variant,
  initialName,
  initialDescription,
  onSave,
  onCancel,
}: EditContactFormProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  return (
    <div className="mt-3 p-3 bg-[#1a1a1a] rounded-md space-y-3">
      <div>
        <label className="text-xs text-gray-400">Nama</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white text-sm focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs text-gray-400">
          {variant === "user" ? "Bio" : "Deskripsi"}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white text-sm focus:outline-none"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-gray-700 rounded-md text-xs hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(name, description)}
          className="px-3 py-1 bg-blue-600 rounded-md text-xs hover:bg-blue-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}
