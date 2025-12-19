"use client";

import { useState } from "react";
import { UIMessage } from "@/types/chat.types";

type PollMessage = {
  type: "poll";
  question: string;
  options: { text: string; votes: number }[];
};

interface PollBubbleProps {
  message: UIMessage;
  isMe: boolean;
}

/**
 * Poll bubble component - displays interactive poll
 */
export function PollBubble({ message, isMe }: PollBubbleProps) {
  const [votedIndex, setVotedIndex] = useState<number | null>(null);

  // Parse poll data dari cipher_text
  let pollData: PollMessage | null = null;
  try {
    if (typeof message.cipher_text === "string") {
      pollData = JSON.parse(message.cipher_text);
    }
  } catch {
    return null;
  }

  if (!pollData || pollData.type !== "poll") return null;

  const totalVotes = pollData.options.reduce((a, b) => a + b.votes, 0);

  return (
    <div
      className={`flex w-full mb-4 px-4 ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          relative w-full max-w-[400px] rounded-2xl px-4 py-3 backdrop-blur-xl
          ${
            isMe
              ? "bg-blue-600/80 border border-blue-400/20"
              : "bg-gray-800/90 border border-white/10"
          }
        `}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[14px] font-semibold leading-snug text-white">
            {pollData.question}
          </p>
          <span className="text-[10px] uppercase tracking-wider text-gray-400">
            poll
          </span>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {pollData.options.map((opt, i) => {
            const percent =
              totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
            const selected = votedIndex === i;

            return (
              <button
                key={i}
                disabled={votedIndex !== null}
                onClick={() => setVotedIndex(i)}
                className={`
                  relative w-full overflow-hidden rounded-lg px-3 py-2.5
                  text-left text-sm transition-all duration-200
                  ${
                    selected
                      ? "ring-1 ring-white/40 bg-white/15"
                      : "hover:bg-white/10"
                  }
                  ${isMe ? "bg-white/10" : "bg-white/5"}
                `}
              >
                {/* Progress bar */}
                {votedIndex !== null && (
                  <div className="pointer-events-none absolute inset-0">
                    <div
                      className={`h-full transition-all ${
                        isMe ? "bg-white/30" : "bg-white/20"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <span className="font-medium text-white">{opt.text}</span>
                  {votedIndex !== null && (
                    <span className="text-xs opacity-70">{percent}%</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        {votedIndex !== null && (
          <div className="mt-3 flex items-center gap-2 text-xs text-green-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Vote recorded
          </div>
        )}

        {/* Time */}
        <div className="mt-2 text-[11px] opacity-60 text-gray-300">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
