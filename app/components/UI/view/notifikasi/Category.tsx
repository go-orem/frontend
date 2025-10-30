"use client";

import React, { useState } from "react";
type SliderItem = {
  label: string;
};

function CategoryNotif() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const menu: SliderItem[] = [
    { label: "Teman" },
    { label: "Mengikuti" },
    { label: "Gabung" },
  ];

  return (
    <div className="w-full overflow-x-auto shrink-0 pb-3 pl-2 pr-2">
      <div className="flex space-x-6 px-4 py-2">
        {menu.map((item, idx) => {
          const isActive = activeIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="group relative flex flex-col items-center justify-center pb-1 cursor-pointer"
            >
              {/* Icon + Label */}
              <div
                className={`flex items-center space-x-2 font-mono text-sm transition-colors ease-in-out ${
                  isActive
                    ? "text-(--primarycolor)"
                    : "text-gray-400 group-hover:text-[--primarycolor]"
                }`}
              >
                <span>{item.label}</span>
              </div>

              {/* Pill */}
              <span
                className={`absolute -bottom-1 h-1 rounded-full bg-(--primarycolor) transition-all duration-300 ease-in-out
                  ${
                    isActive
                      ? "w-10 opacity-100"
                      : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
                  }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryNotif;
