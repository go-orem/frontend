"use client";
import React, { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`flex flex-col items-center cursor-pointer justify-between w-9 h-18 rounded-full p-1 mb-5 transition-colors duration-300 ${
        darkMode ? "bg-gray-800" : "bg-gray-700"
      }`}
    >
      <span className={`${darkMode ? "opacity-30" : "opacity-100"} transition`}>
        ☀️
      </span>

      <span className={`${darkMode ? "opacity-100" : "opacity-30"} transition`}>
        🌙
      </span>
    </button>
  );
}
