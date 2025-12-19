"use client";
import React, { useState } from "react";

type PollData = {
  question: string;
  options: string[];
};

type PollComposerProps = {
  open: boolean;
  onClose: () => void;
  onSend: (poll: PollData) => void;
};

export default function PollComposer({
  open,
  onClose,
  onSend,
}: PollComposerProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  if (!open) return null;

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const updateOption = (index: number, value: string) => {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  };

  const submitPoll = () => {
    if (!question || options.filter(Boolean).length < 2) return;

    onSend({
      question,
      options: options.filter(Boolean),
    });

    setQuestion("");
    setOptions(["", ""]);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur z-30 flex items-end">
      <div className="w-full rounded-t-2xl bg-(--background) p-5 space-y-4">
        <h3 className="font-bold text-white">Create Poll</h3>

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="w-full p-3 rounded-lg bg-black/30 text-white outline-none"
        />

        <div className="space-y-2">
          {options.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="w-full p-3 rounded-lg bg-black/20 text-white outline-none"
            />
          ))}
        </div>

        <button
          onClick={addOption}
          className="text-sm text-(--primarycolor)"
        >
          + Add option
        </button>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-white/10 text-white"
          >
            Cancel
          </button>
          <button
            onClick={submitPoll}
            className="flex-1 py-3 rounded-lg bg-(--primarycolor) text-black font-bold"
          >
            Send Poll
          </button>
        </div>
      </div>
    </div>
  );
}
