"use client";
import React, { useEffect, useState } from "react";
import { ChatWindow, HeaderSplit } from "../UI";
import { InfoSidebar } from "../pages/chat";

export default function MainContent() {
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved === "true") {
      setOpenSidebar(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", openSidebar.toString());
  }, [openSidebar]);

  // contoh data user
  const userData = {
    avatar:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3JpMzBob2Nha3A2eG9xa2pocWh1ZGs2YjczMXB0eXpzN3Vyam1nZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1zhqIaTw4q3ZeuDq8i/giphy.gif",
    cover:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjk5Z2ZyYnp0N2UzbWdtaWp4dmpjcXRxb3VyNzlkMW50NjQ0ZHduZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/z7wIVXPnpm1DiJDdsU/giphy.gif",
    name: "Syarifa 🦋🐥🐝",
    status: "@syarifa",
    bio: "Teruskan kerja keras kamu sampai bisa, membeli rumah impian lo dengan caranya sendiri, dengan skill yang mumpuni 🦋🐥🐝",
    members: [
      {
        name: "Febri Riyan",
        avatar:
          "https://i.pinimg.com/474x/ce/cc/5a/cecc5a1270bac97d96f222ceffbd695f.jpg",
      },
      {
        name: "Syarifa",
        avatar:
          "https://i.pinimg.com/474x/8a/ce/d3/8aced384f4491bfcc0e68d0ff1a9fb77.jpg",
      },
      {
        name: "Febri Riyan",
        avatar:
          "https://i.pinimg.com/474x/e9/5a/b6/e95ab6c5292a756e0198d3ab8da2a8e1.jpg",
      },
      {
        name: "Syarifa",
        avatar:
          "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600",
      },
    ],
    mediaItems: [
      {
        src: "https://i.pinimg.com/474x/b3/23/9d/b3239d8a6ce737fe1c0997d68c40dc6c.jpg",
        alt: "Media 1",
      },
      {
        src: "https://i.pinimg.com/474x/81/97/95/819795633bb655204b3022097ba53e5a.jpg",
        alt: "Media 2",
      },
      {
        src: "https://i.pinimg.com/474x/ce/cc/5a/cecc5a1270bac97d96f222ceffbd695f.jpg",
        alt: "Media 3",
      },
      {
        src: "https://i.pinimg.com/474x/c7/b2/5e/c7b25ec9fc7944794afbc6a1a13414a4.jpg",
        alt: "Media 1",
      },
      {
        src: "https://i.pinimg.com/474x/30/1a/9d/301a9d6b0f219674500b8ce89ab5ea88.jpg",
        alt: "Media 2",
      },
      {
        src: "https://i.pinimg.com/474x/13/3d/a6/133da6735d9f7fabb78ae11fd9caf4cb.jpg",
        alt: "Media 3",
      },
    ],
    files: ["Dokumen.pdf", "Proposal.docx"],
    voice: ["Voice 1", "Voice 2"],
    links: ["https://bloop.id", "https://discord.com"],
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div
        className={`flex flex-col transition-all duration-300 ${
          openSidebar
            ? "w-0 opacity-0 overflow-hidden lg:opacity-100 lg:w-[calc(100%-350px)]"
            : "w-full opacity-100"
        }`}
      >
        <HeaderSplit onProfileClick={() => setOpenSidebar(!openSidebar)} />
        <ChatWindow />
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          openSidebar ? "max-w-[350px] opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        <div className="w-auto border-l border-gray-700 bg-[--background] h-full">
          <InfoSidebar
            variant="user"
            data={userData}
            onClose={() => setOpenSidebar(false)}
          />
        </div>
      </div>
    </div>
  );
}
