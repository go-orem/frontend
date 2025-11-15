import React, { useRef, useState, useEffect } from "react";

function CardBalance({ data }: { data: any }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });
  const [mouseInside, setMouseInside] = useState(false);

  useEffect(() => {
    // subtle idle animation for small motion when not hovered
    let raf: number | null = null;
    let t = 0;
    const loop = () => {
      t += 0.01;
      if (!mouseInside) {
        setTilt((s) => ({
          rx: Math.sin(t) * 0.6,
          ry: Math.cos(t / 1.2) * 0.6,
          tx: Math.sin(t / 1.7) * 4,
          ty: Math.cos(t / 1.4) * 3,
        }));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mouseInside]);

  const handleMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const px = (x - cx) / cx; // -1 .. 1
    const py = (y - cy) / cy;
    // rotate limits
    const ry = px * 8; // rotateY
    const rx = -py * 6; // rotateX
    const tx = px * 18; // translate for layers
    const ty = py * 12;
    setTilt({ rx, ry, tx, ty });
    setMouseInside(true);
  };

  const handleLeave = () => {
    setMouseInside(false);
    // smooth reset handled by idle animation loop
  };

  // box-shadow stack for real glow (approximate)
  const glowShadows = [
    "0 0 8px rgba(48,213,255,0.08)",
    "0 6px 18px rgba(48,213,255,0.06)",
    "0 12px 40px rgba(48,213,255,0.04)",
    "0 30px 80px rgba(48,213,255,0.03)",
  ].join(", ");

  return (
    <>
      <style>{`
        /* keyframes */
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes plasma { 0% {filter: hue-rotate(0deg);} 50% {filter: hue-rotate(35deg);} 100% {filter: hue-rotate(0deg);} }
        @keyframes tech-slide { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }
        @keyframes laser-slide { 0% { transform: translateX(-30%) translateY(-10%) } 50% { transform: translateX(0%) translateY(10%)} 100% { transform: translateX(-30%) translateY(-10%)}}
      `}</style>

      <div
        ref={wrapRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative mt-6 rounded-[20px] p-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "none",
          minHeight: 220,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Nebula plasma layer (animated gradient + noise) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            mixBlendMode: "screen",
            opacity: 0.9,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(45% 30% at 10% 20%, rgba(48,213,255,0.12), transparent 10%), radial-gradient(40% 40% at 90% 70%, rgba(27,159,196,0.08), transparent 12%)",
              filter: "blur(40px)",
              animation: "plasma 6s ease-in-out infinite",
            }}
          />
          {/* subtle moving plasma layer SVG */}
          <svg
            viewBox="0 0 800 400"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "120%",
              height: "120%",
              transform: `translate(${tilt.tx * -0.5}px, ${tilt.ty * -0.4}px)`,
              opacity: 0.55,
              filter: "blur(28px) contrast(120%)",
            }}
          >
            <defs>
              <linearGradient id="n1" x1="0" x2="1">
                <stop offset="0%" stopColor="#30d5ff" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#1b9fc4" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#146e85" stopOpacity="0.08" />
              </linearGradient>
              <filter id="grain">
                <feTurbulence
                  baseFrequency="0.9"
                  numOctaves="1"
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
                <feBlend in="SourceGraphic" />
              </filter>
            </defs>

            <g fill="url(#n1)">
              <path
                d="M0 180 C120 100 240 220 360 160 C480 100 600 220 800 160 L800 400 L0 400 Z"
                opacity="0.9"
              />
            </g>
          </svg>
        </div>

        <svg
          viewBox="0 0 600 600"
          className="absolute left-[-10%] top-[-20%] w-[60%] h-[60%] opacity-40 pointer-events-none"
          style={{
            zIndex: 1,
            transform: `translate3d(${tilt.tx * -0.25}px, ${
              tilt.ty * -0.18
            }px, 0) rotate(${tilt.ry * 0.6}deg)`,
            transition: "transform 120ms linear",
            animation: "spin-slow 45s linear infinite",
            filter: "blur(6px)",
          }}
        >
          <defs>
            <pattern
              id="hex"
              width="60"
              height="52"
              patternUnits="userSpaceOnUse"
            >
              <g stroke="#30d5ff" strokeWidth="0.6" fill="none" opacity="0.12">
                <path d="M30 0 L60 15 L60 45 L30 60 L0 45 L0 15 Z" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>

        <svg
          viewBox="0 0 500 200"
          className="absolute right-0 top-0 w-[45%] h-[55%] opacity-25 pointer-events-none"
          style={{
            zIndex: 2,
            transform: `translate3d(${tilt.tx * -0.45}px, ${
              tilt.ty * -0.32
            }px, 0)`,
            transition: "transform 120ms linear",
            animation: "spin-slow 60s linear reverse infinite",
            filter: "blur(2px)",
          }}
        >
          <defs>
            <linearGradient id="gline" x1="0" x2="1">
              <stop offset="0%" stopColor="#30d5ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1b9fc4" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <g stroke="url(#gline)" strokeWidth="0.6" strokeLinecap="round">
            {/* grid lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={i}
                x1={i * 50}
                y1={0}
                x2={i * 50}
                y2={200}
                opacity={0.45}
              />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={"h" + i}
                x1={0}
                y1={i * 40}
                x2={500}
                y2={i * 40}
                opacity={0.35}
              />
            ))}
          </g>
        </svg>

        <svg
          viewBox="0 0 800 300"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            zIndex: 3,
            transform: `translate3d(${tilt.tx * -0.18}px, ${
              tilt.ty * -0.12
            }px, 0)`,
            transition: "transform 120ms linear",
          }}
        >
          <defs>
            <linearGradient id="lg1" x1="0" x2="1">
              <stop offset="0%" stopColor="#30d5ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1b9fc4" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <path
            d="M20 60 C140 20 260 120 380 80 C500 40 620 140 760 100"
            fill="none"
            stroke="url(#lg1)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="220"
            strokeDashoffset="220"
            style={{
              animation: "tech-slide 2.5s linear infinite",
              opacity: 0.95,
              filter: "drop-shadow(0 4px 12px rgba(48,213,255,0.12))",
            }}
          />
          <path
            d="M0 180 C120 140 240 220 360 180 C480 140 600 220 800 180"
            fill="none"
            stroke="rgba(48,213,255,0.18)"
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{ opacity: 0.6 }}
          />
        </svg>

        <div
          className="relative z-10"
          style={{
            transform: `translateZ(80px) translate(${tilt.tx * 0.02}px, ${
              tilt.ty * 0.02
            }px)`,
            transition: "transform 120ms linear",
          }}
        >
          <p className="text-sm text-gray-300 mb-2">Total Balance</p>

          <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_0_26px_rgba(48,213,255,0.18)]">
            {data?.balance ?? "12.95"}{" "}
            <span className="text-lg font-semibold ml-2">OREM</span>
          </h1>

          <p className="text-gray-400 text-xs mt-2">
            ≈ ${data?.balanceUSD ?? "120.89"}
          </p>
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 12,
            mixBlendMode: "overlay",
            opacity: mouseInside ? 1 : 0.6,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40%",
              left: "-30%",
              width: "200%",
              height: "200%",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 10%, rgba(255,255,255,0.01) 40%, rgba(255,255,255,0.02) 70%, transparent 100%)",
              transform: `translate3d(${tilt.tx * -0.08}px, ${
                tilt.ty * -0.05
              }px, 0) rotate(${tilt.ry * 0.2}deg)`,
              transition: "transform 140ms linear, opacity 280ms linear",
              filter: "blur(12px)",
            }}
          />
        </div>
      </div>
    </>
  );
}

export default CardBalance;
