"use client";

import { useState } from "react";

/**
 * Gráficos SVG do painel — paleta validada para o fundo #101014
 * (banda de luminosidade OKLCH dark, separação CVD com rótulos
 * diretos como codificação secundária, contraste ≥ 3:1).
 */
export const CHART = {
  primary: "#d97706",
  disponivel: "#059669",
  negociacao: "#ea580c",
  vendido: "#0284c7",
} as const;

export function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${className}`}
    >
      <h2 className="font-bold">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-center text-sm text-white/35">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Barras verticais                                                   */
/* ------------------------------------------------------------------ */

export function BarChart({
  data,
  color = CHART.primary,
  format = (v: number) => String(v),
  height = 190,
}: {
  data: { label: string; value: number }[];
  color?: string;
  format?: (v: number) => string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560;
  const PAD = { t: 18, b: 26, l: 8, r: 8 };
  const max = Math.max(1, ...data.map((d) => d.value));
  const iw = W - PAD.l - PAD.r;
  const ih = height - PAD.t - PAD.b;
  const bw = Math.min(48, (iw / data.length) * 0.62);
  const step = iw / data.length;
  const peak = data.reduce((m, d, i) => (d.value > data[m].value ? i : m), 0);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="w-full"
        role="img"
        aria-label="Gráfico de barras"
      >
        {/* linhas de grade recessivas */}
        {[0.5, 1].map((f) => (
          <line
            key={f}
            x1={PAD.l}
            x2={W - PAD.r}
            y1={PAD.t + ih - ih * f}
            y2={PAD.t + ih - ih * f}
            stroke="rgba(255,255,255,0.07)"
          />
        ))}
        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={PAD.t + ih}
          y2={PAD.t + ih}
          stroke="rgba(255,255,255,0.18)"
        />
        {data.map((d, i) => {
          const h = Math.max(2, (d.value / max) * ih);
          const x = PAD.l + step * i + (step - bw) / 2;
          const y = PAD.t + ih - h;
          const active = hover === i;
          return (
            <g
              key={d.label}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {/* alvo de hover maior que a marca */}
              <rect
                x={PAD.l + step * i}
                y={PAD.t}
                width={step}
                height={ih}
                fill="transparent"
              />
              <path
                d={`M${x},${y + h} L${x},${y + 4} Q${x},${y} ${x + 4},${y} L${x + bw - 4},${y} Q${x + bw},${y} ${x + bw},${y + 4} L${x + bw},${y + h} Z`}
                fill={color}
                opacity={hover === null || active ? 1 : 0.45}
                style={{ transition: "opacity 150ms" }}
              />
              {/* rótulo direto: pico e barra sob o mouse */}
              {(active || (hover === null && i === peak)) && d.value > 0 && (
                <text
                  x={x + bw / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-white text-[11px] font-semibold"
                >
                  {format(d.value)}
                </text>
              )}
              <text
                x={PAD.l + step * i + step / 2}
                y={height - 8}
                textAnchor="middle"
                className="fill-white/45 text-[11px]"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 rounded-lg border border-white/15 bg-[#1a1a1f] px-3 py-1.5 text-xs shadow-xl">
          <span className="text-white/60">{data[hover].label}: </span>
          <span className="font-bold">{format(data[hover].value)}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rosca (status do estoque)                                          */
/* ------------------------------------------------------------------ */

export function Donut({
  segments,
  centerLabel,
}: {
  segments: { label: string; value: number; color: string }[];
  centerLabel: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0);
  const R = 62;
  const SW = 26;
  const C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0">
        <circle
          cx="80"
          cy="80"
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={SW}
        />
        {segments.map((s, i) => {
          if (!s.value) return null;
          const frac = s.value / total;
          // gap de 2px entre segmentos (espaçador da superfície)
          const gap = segments.filter((x) => x.value).length > 1 ? 2 : 0;
          const len = Math.max(0, C * frac - gap);
          const off = C * 0.25 - acc * C;
          acc += frac;
          const active = hover === i;
          return (
            <circle
              key={s.label}
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={active ? SW + 4 : SW}
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={off}
              strokeLinecap="butt"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ transition: "stroke-width 150ms", cursor: "default" }}
            />
          );
        })}
        <text
          x="80"
          y="76"
          textAnchor="middle"
          className="fill-white text-[26px] font-bold"
        >
          {hover !== null ? segments[hover].value : total}
        </text>
        <text
          x="80"
          y="96"
          textAnchor="middle"
          className="fill-white/45 text-[11px]"
        >
          {hover !== null ? segments[hover].label : centerLabel}
        </text>
      </svg>
      {/* legenda com rótulos diretos */}
      <ul className="space-y-2.5">
        {segments.map((s, i) => (
          <li
            key={s.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`flex items-center gap-2.5 text-sm transition ${
              hover === null || hover === i ? "opacity-100" : "opacity-40"
            }`}
          >
            <span
              className="h-3 w-3 rounded-sm"
              style={{ background: s.color }}
            />
            <span className="text-white/70">{s.label}</span>
            <span className="ml-auto pl-4 font-bold">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ranking horizontal                                                 */
/* ------------------------------------------------------------------ */

export function HBars({
  data,
  color = CHART.primary,
  format = (v: number) => String(v),
}: {
  data: { label: string; value: number }[];
  color?: string;
  format?: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="space-y-3">
      {data.map((d, i) => (
        <li
          key={d.label}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          className={`transition ${hover === null || hover === i ? "opacity-100" : "opacity-45"}`}
        >
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="text-white/75">{d.label}</span>
            <span className="font-bold">{format(d.value)}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: color,
                transition: "width 500ms cubic-bezier(.2,.8,.2,1)",
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  KPI                                                                */
/* ------------------------------------------------------------------ */

export function Kpi({
  label,
  value,
  accent = "text-white",
  hint,
}: {
  label: string;
  value: string;
  accent?: string;
  hint?: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]">
      <p className="text-xs text-white/40">{label}</p>
      <p className={`mt-1 text-xl font-bold ${accent}`}>{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-white/30">{hint}</p>}
    </div>
  );
}
