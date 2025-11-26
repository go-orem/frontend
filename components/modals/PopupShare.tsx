"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaInstagramSquare,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { FaBluesky, FaX } from "react-icons/fa6";

interface SidebarSharePanelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  url: string;
  title: string;
  description?: string;
}

export default function SidebarSharePanel({
  open,
  setOpen,
  url,
  title,
  description,
}: SidebarSharePanelProps) {
  const icons = [
    {
      icon: <FaInstagram size={20} />,
      color: "from-pink-500 via-red-500 to-yellow-500",
    },
    { icon: <FaFacebook size={20} />, color: "text-blue-600" },
    { icon: <FaLinkedin size={20} />, color: "text-blue-500" },
    { icon: <FaWhatsapp size={20} />, color: "text-green-500" },
    { icon: <FaX size={20} />, color: "text-gray-400" },
    { icon: <FaBluesky size={20} />, color: "text-sky-400" },
  ];
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link disalin ke clipboard");
    } catch (err) {
      console.error("Gagal menyalin link:", err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={setOpen} // <== ini penting
      className="relative z-50"
    >
      {/* Backdrop bawaan */}
      <div className="fixed inset-0 w-auto bg-black/60" aria-hidden="true" />

      {/* Panel sliding dari kanan */}
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          className={`w-screen max-w-sm bg-white dark:bg-(--background) p-6 shadow-xl transform transition ease-out`}
        >
          <div className="flex items-center justify-between font-mono">
            <h2 className="text-lg font-semibold font-mono">Bagikan</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {description && (
            <p className="mt-2 text-xs font-mono text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}

          <div className="mt-4 flex flex-col justify-between items-center">
            <div className="flex space-x-3">
              {icons.map((item, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`p-3 rounded-full bg-gray-800 hover:bg-gray-700 hover:scale-110 transition-transform duration-200 flex items-center justify-center ${item.color} shadow-md`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
            {/* Tambahkan tombol share lain */}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
