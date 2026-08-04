"use client";

import { useState } from "react";
import { masterplan } from "@/data/farmland";

const statusStyles: Record<string, { fill: string; stroke: string }> = {
  Available: { fill: "rgba(197,162,107,0.32)", stroke: "#c5a26b" },
  Reserved: { fill: "rgba(122,114,99,0.3)", stroke: "#7a7263" },
  Sold: { fill: "rgba(14,14,11,0.22)", stroke: "#0e0e0b" },
};

export function FarmlandMap() {
  const [active, setActive] = useState<string | null>(null);
  const selected = masterplan.plots.find((p) => p.id === active);

  return (
    <div className="border border-ink/15 bg-stone">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 px-6 py-5">
        <p className="eyebrow text-slate">{masterplan.name}</p>
        <p className="font-mono text-[11px] tracking-[0.1em] text-ink/50">
          Hover the plan to read each holding
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
        <svg
          viewBox="0 0 100 100"
          className="h-auto w-full"
          role="img"
          aria-label="Interactive masterplan of the river plate with individual plots"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            fill="rgba(248,245,240,0.7)"
            stroke="rgba(122,114,99,0.5)"
            strokeWidth="0.15"
          />
          <line
            x1="4"
            y1="90"
            x2="96"
            y2="90"
            stroke="rgba(122,114,99,0.4)"
            strokeWidth="0.2"
            strokeDasharray="2 0.7"
          />
          {masterplan.river && (
            <path
              d="M0 88 C 25 72, 40 92, 60 80 S 90 62, 100 68"
              fill="none"
              stroke="rgba(122,114,99,0.6)"
              strokeWidth="1.3"
              strokeDasharray="1 0.8"
            />
          )}
          {masterplan.plots.map((p) => {
            const s = statusStyles[p.status];
            const isActive = active === p.id;
            return (
              <g
                key={p.id}
                onMouseEnter={() => setActive(p.id)}
                onMouseLeave={() => setActive(null)}
                className="cursor-pointer"
              >
                <rect
                  x={p.x}
                  y={p.y}
                  width="20"
                  height="22"
                  rx="0.4"
                  fill={s.fill}
                  stroke={isActive ? "#1a1a1a" : s.stroke}
                  strokeWidth={isActive ? 0.5 : 0.18}
                  style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
                />
                <text
                  x={p.x + 10}
                  y={p.y + 12.5}
                  textAnchor="middle"
                  fontSize="3.2"
                  fill={isActive ? "#1a1a1a" : "#7a7263"}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {p.id}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="border-t border-ink/15 p-6 md:border-l md:border-t-0">
          <p className="eyebrow text-slate">Plot detail</p>
          {selected ? (
            <dl className="mt-4 space-y-3 text-[14px]">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink/50">Plot</dt>
                <dd className="font-display text-3xl font-light text-ink">
                  {selected.id}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/50">Size</dt>
                <dd className="text-ink">{selected.size}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/50">Phase</dt>
                <dd className="text-ink">{selected.phase === 1 ? "Phase 1" : "Phase 2"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/50">Status</dt>
                <dd className="text-ink">{selected.status}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-[14px] leading-relaxed text-ink/60">
              Hover the plan to read each holding. Available plots are marked in
              emerald.
            </p>
          )}

          <div className="mt-6 space-y-2.5 border-t border-ink/10 pt-5">
            {Object.keys(statusStyles).map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-4 border"
                  style={{
                    backgroundColor: statusStyles[s].fill,
                    borderColor: statusStyles[s].stroke,
                  }}
                />
                <span className="text-[12px] uppercase tracking-[0.14em] text-ink/60">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
