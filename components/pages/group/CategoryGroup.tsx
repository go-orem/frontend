"use client";

import React, { useRef, useState } from "react";

type SliderItem = { label: string };

export default function CategoryGroup() {
  const [activeIndex, setActiveIndex] = useState(0);

  const menu: SliderItem[] = [
    { label: "Hot 🔥" },
    { label: "New 🧩" },
    { label: "Indonesia 🇮🇩" },
    { label: "Token 🪙" },
    { label: "Trending 🚀" },
    { label: "Blockchain 🦄" },
    { label: "Announcement 📢" },
  ];

  const slider = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const momentumID = useRef<number | null>(null);

  const momentum = () => {
    if (!slider.current) return;
    const friction = 0.95;
    velocity.current *= friction;
    slider.current.scrollLeft -= velocity.current;

    if (Math.abs(velocity.current) > 0.3) {
      momentumID.current = requestAnimationFrame(momentum);
    } else {
      cancelAnimationFrame(momentumID.current!);
      momentumID.current = null;
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!slider.current) return;
    isDragging.current = true;
    slider.current.classList.add("cursor-grabbing");

    startX.current = e.pageX - slider.current.offsetLeft;
    scrollLeft.current = slider.current.scrollLeft;

    velocity.current = 0;
    lastX.current = e.pageX;
    lastTime.current = Date.now();

    if (momentumID.current) cancelAnimationFrame(momentumID.current);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !slider.current) return;
    e.preventDefault();

    const x = e.pageX - slider.current.offsetLeft;
    const walk = x - startX.current;
    slider.current.scrollLeft = scrollLeft.current - walk;

    const now = Date.now();
    const dx = e.pageX - lastX.current;
    const dt = now - lastTime.current;
    velocity.current = (dx / dt) * 20;

    lastX.current = e.pageX;
    lastTime.current = now;
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    slider.current?.classList.remove("cursor-grabbing");
    momentum();
  };

  const handleClick = (idx: number) => {
    setActiveIndex(idx);

    // scroll clicked item into view
    const itemEl = itemRefs.current[idx];
    if (itemEl && slider.current) {
      itemEl.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  };

  return (
    <div
      ref={slider}
      className="w-full overflow-x-auto shrink-0 pb-3 pl-2 pr-2 cursor-grab select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <div className="flex space-x-6 px-4 py-2">
        {menu.map((item, idx) => {
          const isActive = activeIndex === idx;

          return (
            <div
              key={idx}
              ref={(el) => {
                itemRefs.current[idx] = el ?? null;
              }}
              onClick={() => handleClick(idx)}
              className="group relative flex flex-row items-center justify-center pb-1 cursor-pointer"
            >
              <div
                className={`flex items-center space-x-2 font-mono text-sm transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-(--primarycolor)"
                    : "text-gray-400 group-hover:text-(--primarycolor)"
                }`}
              >
                <span>{item.label}</span>
              </div>

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
