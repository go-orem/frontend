"use client";
import React from "react";
import IconVideo from "../../icons/IconVideo";
import IconCall from "../../icons/IconCall";
import IconSearch from "../../icons/IconSearch";

function HeaderSplit({ onProfileClick }: { onProfileClick: () => void }) {
  return (
    <div className="header-atas w-auto p-2 pl-5.5 pr-5.5 flex justify-between h-min border-b-[0.5px] border-gray-700 items-center bg-(--background)">
      <div
        className="container flex space-x-3 items-center cursor-pointer"
        onClick={onProfileClick}
      >
        <div className="profile">
          <img
            className="w-10 h-10 rounded-full object-cover border-3 border-pink-400"
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3JpMzBob2Nha3A2eG9xa2pocWh1ZGs2YjczMXB0eXpzN3Vyam1nZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1zhqIaTw4q3ZeuDq8i/giphy.gif"
            alt=""
          />
        </div>
        <div>
          <div className="name font-mono text-sm font-semibold">Syarifa </div>
          <p className="font-mono text-xs text-gray-400">Mengetik...</p>
        </div>
      </div>
      <div className="flex space-x-6 cursor-pointer">
        <IconVideo />
        <IconCall />
        <IconSearch />
      </div>
    </div>
  );
}

export default HeaderSplit;
