import React from "react";

type Props = {
  pasteCandidate: string | null;
  accept: () => void;
  reject: () => void;
};

export default function PasteBanner({ pasteCandidate, accept, reject }: Props) {
  if (!pasteCandidate) return null;
  return (
    <div className="absolute left-0 -top-16 w-full
            bg-[#0F0F10]/40 backdrop-blur-lg border border-white/10 
            rounded-xl p-3 z-50 shadow-xl">
      <div className="flex items-start justify-between">
        <div className="text-sm text-gray-200">
          <div className="font-semibold font-mono">Detected pasted content</div>
          <div className="text-xs text-gray-300 mt-1 font-mono">
            Convert into a fenced code block?
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={accept}
            className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-500 text-sm font-mono"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={reject}
            className="px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-sm font-mono"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
