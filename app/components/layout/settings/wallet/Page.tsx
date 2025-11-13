"use client";
import React from "react";

interface WalletSettingsProps {
  data: any;
  onClose: () => void;
}

export default function WalletSettings({ data, onClose }: WalletSettingsProps) {
  return (
    <aside className="h-full w-full bg-[--background] text-gray-200 flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-mono font-bold">Wallet</h2>
        <button
          onClick={onClose}
          className="text-sm text-gray-400 hover:text-white cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-sm font-mono">
        <div>
          <span className="text-gray-400">Nama: </span>{" "}
          {data?.name ?? "Belum diatur"}
        </div>
        <div>
          <span className="text-gray-400">Email: </span>{" "}
          {data?.email ?? "Belum diatur"}
        </div>
        <div>
          <span className="text-gray-400">Status: </span>{" "}
          {data?.status ?? "Aktif"}
        </div>

        <button className="mt-4 w-full py-2 rounded-md bg-[--hovercolor] hover:bg-opacity-80 transition font-bold">
          Simpan Perubahan
        </button>
      </div>
    </aside>
  );
}