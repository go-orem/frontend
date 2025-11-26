// app/components/charts/ChartsSVG.tsx
"use client";
import React, { useMemo } from "react";

type Point = { name?: string; value: number };
type Size = { width?: number | string; height?: number | string };

const H = "#30d5ff";
const H2 = "#1b9fc4";
const H3 = "#146e85";

/* normalize numeric array to svg coords (0..100) */
function normalize(data: number[]) {
  if (!data || !data.length) return [];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  return data.map((v) => ((v - min) / range) * 100);
}

/* responsive wrapper */
function Wrap({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: 80, ...style }}>
      {children}
    </div>
  );
}

/* ---------------- Line Chart ---------------- */
export function ChartToken({ data, stroke = H, strokeWidth = 0.6 }: { data: number[]; stroke?: string; strokeWidth?: number }) {
  const points = useMemo(() => normalize(data).map((v, i) => `${(i / (data.length - 1)) * 100},${100 - v}`).join(" "), [data]);

  return (
    <Wrap>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <linearGradient id="lineGrad" x1="0" x2="1">
            <stop offset="0%" stopColor={H} stopOpacity="1"/>
            <stop offset="100%" stopColor={H2} stopOpacity="0.8"/>
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <polyline points={points + " 100,100 0,100"} fill={H} fillOpacity={0.05}/>
        {[0, 25, 50, 75, 100].map((g) => (
          <line key={g} x1="0" x2="100" y1={g} y2={g} stroke="#ffffff0d" strokeWidth={0.15} shapeRendering="crispEdges"/>
        ))}
        <polyline
          points={points}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "url(#softGlow)", strokeDasharray: 1000, strokeDashoffset: 1000, animation: "draw 1.2s forwards ease-out" }}
        />
        {normalize(data).map((v, i) => (
          <circle key={i} cx={(i / (data.length - 1)) * 100} cy={100 - v} r={1.2} fill={H2} style={{ filter: "url(#softGlow)" }}/>
        ))}
      </svg>

      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
    </Wrap>
  );
}

/* ---------------- Area Chart ---------------- */
export function AreaChartSVG({ data, colors = [H, H2] }: { data: number[]; colors?: string[] }) {
  const norm = normalize(data);
  const path = useMemo(() => norm.map((v,i)=>`${(i/(norm.length-1))*100},${100-v}`).join(" ") + " 100,100 0,100", [norm]);

  return (
    <Wrap>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={colors[0]} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={colors[1]} stopOpacity="0.03"/>
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <path d={`M ${path}`} fill="url(#areaGrad)" stroke="none"/>
        <polyline
          points={norm.map((v,i)=>`${(i/(norm.length-1))*100},${100-v}`).join(" ")}
          fill="none"
          stroke={colors[0]}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 400, strokeDashoffset: 400, animation: "draw 900ms forwards ease-out", filter:"url(#glow)" }}
        />
      </svg>

      <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
    </Wrap>
  );
}

/* ---------------- Bar Chart ---------------- */
export function BarChartSVG({ data, colors = [H, H2], gap = 6 }: { data: number[]; colors?: string[]; gap?: number }) {
  const max = Math.max(...data,1);
  const cols = data.length;

  return (
    <Wrap>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={colors[0]} stopOpacity="1"/>
            <stop offset="100%" stopColor={colors[1]} stopOpacity="0.7"/>
          </linearGradient>
          <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.8" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {data.map((v,i)=>{
          const w = (100-gap*(cols+1))/cols/1.4;
          const x = gap + i*(w+gap);
          const h = (v/max)*86;
          return <rect
            key={i}
            x={x}
            y={100-h}
            width={w}
            height={h}
            rx={2}
            fill="url(#barGrad)"
            style={{ transformOrigin:`${x+w/2}% 50%`, transform:"translateY(8px)", animation:`barUp 600ms ${i*70}ms forwards ease-out`, filter:"url(#barGlow)" }}
          />
        })}
      </svg>

      <style>{`@keyframes barUp { to { transform: translateY(0); } }`}</style>
    </Wrap>
  );
}

/* ---------------- Donut Chart ---------------- */
export function DonutChartSVG({ data, colors = [H,H2,H3], size=100, inner=30 }: { data: Point[]; colors?: string[]; size?: number; inner?: number }) {
  const total = data.reduce((s,d)=>s+d.value,0)||1;
  let acc = 0;
  const cx=50, cy=50, r=36;

  return (
    <Wrap>
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="donutGrad" x1="0" x2="1">
            <stop offset="0%" stopColor={H}/>
            <stop offset="100%" stopColor={H2}/>
          </linearGradient>
          <filter id="donutGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffffff08" strokeWidth={inner/8}/>

        {data.map((d,i)=>{
          const start = (acc/total)*Math.PI*2 - Math.PI/2;
          acc+=d.value;
          const end = (acc/total)*Math.PI*2 - Math.PI/2;
          const large = end-start>Math.PI?1:0;
          const x1=cx+r*Math.cos(start);
          const y1=cy+r*Math.sin(start);
          const x2=cx+r*Math.cos(end);
          const y2=cy+r*Math.sin(end);
          const path=`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
          const color=colors[i%colors.length];
          return <path key={i} d={path} fill={color} fillOpacity={0.12} style={{transition:"all 240ms linear", filter:"url(#donutGlow)"}}/>
        })}

        <circle cx={cx} cy={cy} r={inner} fill="#0b0b0b"/>
      </svg>
    </Wrap>
  );
}

/* ---------------- Waveform Chart ---------------- */
export function WaveformSVG({ data, color=H }: { data: number[]; color?: string }) {
  const norm = normalize(data);
  const path = useMemo(()=>{
    const step = 100/(norm.length-1);
    return norm.map((v,i)=>{
      const x=i*step;
      const y=50-(v/100)*30;
      return `${i===0?"M":"L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    }).join(" ")
  },[data]);

  return (
    <Wrap>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <linearGradient id="waveGrad" x1="0" x2="1">
            <stop offset="0%" stopColor={H} stopOpacity="1"/>
            <stop offset="100%" stopColor={H2} stopOpacity="1"/>
          </linearGradient>
          <filter id="waveGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <path d={path} stroke="url(#waveGrad)" strokeWidth={2} fill="none" strokeLinecap="round"
          style={{ strokeDasharray: 200, strokeDashoffset: 200, animation:"waveDraw 900ms forwards ease-out", filter:"url(#waveGlow)" }}
        />
      </svg>

      <style>{`@keyframes waveDraw{to{stroke-dashoffset:0;}}`}</style>
    </Wrap>
  );
}

/* ---------------- ChartTabs Demo ---------------- */
export function ChartTabs({ series }: { series?: number[] }) {
  const data = series ?? [40, 80, 20, 90, 60, 30, 50];
  const donutData = [
    { name:"A", value:40 },
    { name:"B", value:30 },
    { name:"C", value:20 },
    { name:"D", value:10 }
  ];
  const [tab, setTab] = React.useState<"line"|"area"|"bar"|"donut"|"wave">("line");

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-3">
        {(["line","area","bar","donut","wave"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`text-xs px-3 py-1 rounded-full font-mono ${tab===t?"bg-[#30d5ff] text-black":"bg-[#141418] text-gray-300"}`}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="w-full h-44 bg-[#0f0f10] rounded-2xl p-3 border border-[#222]">
        {tab==="line" && <ChartToken data={data}/>}
        {tab==="area" && <AreaChartSVG data={data}/>}
        {tab==="bar" && <BarChartSVG data={data}/>}
        {tab==="donut" && <DonutChartSVG data={donutData}/>}
        {tab==="wave" && <WaveformSVG data={data}/>}
      </div>
    </div>
  );
}
