// frontend/src/components/dashboard/SIRChart.tsx
'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { SimulationResult } from '@/types';

interface SIRChartProps {
  data: SimulationResult[];
  loading?: boolean;
  peakDay?: number;
}

/* ── Custom Tooltip ─────────────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;

  const fmt = (v: number) =>
    v >= 1_000_000
      ? `${(v / 1_000_000).toFixed(2)}M`
      : v >= 1_000
      ? `${(v / 1_000).toFixed(1)}K`
      : v.toFixed(0);

  const items = [
    { key: 'infected',    label: 'Infected',    color: '#EF4444' },
    { key: 'susceptible', label: 'Susceptible', color: '#EAB308' },
    { key: 'recovered',   label: 'Recovered',   color: '#22C55E' },
  ];

  return (
    <div className="bg-[#0B0E14] border border-[#1C212B] rounded-xl p-3.5 shadow-xl font-mono text-xs min-w-[160px]">
      <p className="text-[#9CA3AF] mb-2.5 border-b border-[#1C212B] pb-1.5">Day {label}</p>
      {items.map(({ key, label: itemLabel, color }) => {
        const entry = payload.find((p) => p.dataKey === key);
        if (!entry) return null;
        return (
          <div key={key} className="flex justify-between items-center gap-4 mb-1.5">
            <span className="flex items-center gap-1.5" style={{ color }}>
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: color }}
              />
              {itemLabel}
            </span>
            <span className="text-white font-semibold">{fmt(entry.value ?? 0)}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Custom Legend ──────────────────────────────────────────────────────── */
function ChartLegend() {
  const items = [
    { color: '#EF4444', label: 'Infected (I)', key: 'I' },
    { color: '#EAB308', label: 'Susceptible (S)', key: 'S' },
    { color: '#22C55E', label: 'Recovered (R)', key: 'R' },
  ];
  return (
    <div className="flex items-center gap-5">
      {items.map(({ color, label }) => (
        <span key={label} className="flex items-center gap-1.5 text-xs text-[#9CA3AF] font-mono">
          <span className="w-3 h-0.5 inline-block rounded" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

/* ── Axis tick formatters ───────────────────────────────────────────────── */
const formatYAxis = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return `${v}`;
};

const formatXAxis = (v: number) => `D${v}`;

/* ── Main Chart Component ───────────────────────────────────────────────── */
export default function SIRChart({ data, loading = false, peakDay = 0 }: SIRChartProps) {
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-textSecondary">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-primary/30 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-primary rounded-full animate-spin" />
        </div>
        <p className="font-mono text-sm animate-pulse">Computing epidemic trajectory...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-textMuted font-mono text-sm">
        No simulation data. Adjust parameters and run.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {/* Legend row */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <ChartLegend />
        {peakDay > 0 && (
          <span className="text-xs font-mono text-danger/80">
            ⚠ Peak: Day {peakDay}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Susceptible gradient */}
              <linearGradient id="gradS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
              </linearGradient>
              {/* Infected gradient */}
              <linearGradient id="gradI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
              </linearGradient>
              {/* Recovered gradient */}
              <linearGradient id="gradR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(28,33,43,0.8)"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickFormatter={formatXAxis}
              stroke="#1C212B"
              tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#1C212B' }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              stroke="#1C212B"
              tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              width={52}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1C212B', strokeWidth: 1 }} />

            {/* Peak infection reference line */}
            {peakDay > 0 && (
              <ReferenceLine
                x={peakDay}
                stroke="#EF4444"
                strokeDasharray="4 3"
                strokeOpacity={0.5}
                label={{
                  value: 'Peak',
                  position: 'top',
                  fill: '#EF4444',
                  fontSize: 10,
                  fontFamily: 'monospace',
                }}
              />
            )}

            {/* Area layers — order matters for stacking */}
            <Area
              type="monotone"
              dataKey="susceptible"
              name="Susceptible"
              stroke="#EAB308"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#gradS)"
              dot={false}
              activeDot={{ r: 4, fill: '#EAB308', stroke: '#0B0E14', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="recovered"
              name="Recovered"
              stroke="#22C55E"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#gradR)"
              dot={false}
              activeDot={{ r: 4, fill: '#22C55E', stroke: '#0B0E14', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="infected"
              name="Infected"
              stroke="#EF4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#gradI)"
              dot={false}
              activeDot={{ r: 5, fill: '#EF4444', stroke: '#0B0E14', strokeWidth: 2 }}
            />

            {/* Brush / mini navigator */}
            <Brush
              dataKey="day"
              height={28}
              stroke="#1C212B"
              fill="#0B0E14"
              travellerWidth={6}
              tickFormatter={formatXAxis}
              style={{ marginTop: 4 }}
            >
              <AreaChart data={data}>
                <Area
                  type="monotone"
                  dataKey="infected"
                  stroke="#EF4444"
                  strokeWidth={1}
                  fill="rgba(239,68,68,0.15)"
                  dot={false}
                />
              </AreaChart>
            </Brush>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
