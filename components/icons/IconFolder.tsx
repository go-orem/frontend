import React from "react";

const IconFolder = ({ size = 64, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        {/* Gradien Depan: Biru Modern */}
        <linearGradient id="gradFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4facfe" stopOpacity={1} />
          <stop offset="100%" stopColor="#00f2fe" stopOpacity={1} />
        </linearGradient>
        
        {/* Gradien Belakang: Hijau Toska */}
        <linearGradient id="gradBack" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#43e97b" stopOpacity={1} />
          <stop offset="100%" stopColor="#38f9d7" stopOpacity={1} />
        </linearGradient>
      </defs>

      {/* Layer Belakang Folder */}
      <path
        d="M56 20H34.83c-1.06 0-2.07-.42-2.83-1.17l-3.83-3.66a8.06 8.06 0 0 0-5.68-2.37H8c-4.42 0-8 3.58-8 8v30.4c0 4.42 3.58 8 8 8h48c4.42 0 8-3.58 8-8V28c0-4.42-3.58-8-8-8"
        fill="url(#gradBack)"
        opacity="0.6"
      />

      {/* Layer Depan Folder */}
      <path
        d="M56 24H8c-4.42 0-8 3.58-8 8v24c0 4.42 3.58 8 8 8h48c4.42 0 8-3.58 8-8V32c0-4.42-3.58-8-8-8"
        fill="url(#gradFront)"
      />

      {/* Aksen Highlight Putih (Glassmorphism effect) */}
      <path
        d="M8 28h48c2.21 0 4 1.79 4 4v1c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4v-1c0-2.21 1.79-4 4-4"
        fill="#fff"
        opacity="0.3"
      />
    </svg>
  );
};

export default IconFolder;