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
import { SIRDataPoint } from '@/types';
import { useState, useEffect, useCallback, useRef } from 'react';

interface SIRChartProps {
  data: SIRDataPoint[];
  loading?: boolean;
  peakDay?: number;
  onPlayToggle?: () => void;
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
    { key: 'I', label: 'Infected', color: 'var(--sir-infected)' },
    { key: 'S', label: 'Susceptible', color: 'var(--sir-susceptible)' },
    { key: 'R', label: 'Recovered', color: 'var(--sir-recovered)' },
  ];

  return (
    <div className="bg-surface-2 border border-bg-border rounded-xl p-3.5 shadow-xl font-mono text-xs min-w-[160px] z-50">
      <p className="text-textSecondary mb-2.5 border-b border-bg-border pb-1.5">Day {label}</p>
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
            <span className="text-textPrimary font-semibold">{fmt(entry.value ?? 0)}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Custom Legend ──────────────────────────────────────────────────────── */
function ChartLegend() {
  const items = [
    { color: 'var(--sir-infected)', label: 'Infected (I)' },
    { color: 'var(--sir-susceptible)', label: 'Susceptible (S)' },
    { color: 'var(--sir-recovered)', label: 'Recovered (R)' },
  ];
  return (
    <div className="flex items-center gap-5">
      {items.map(({ color, label }) => (
        <span key={label} className="flex items-center gap-1.5 text-xs text-textSecondary font-mono">
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
export default function SIRChart({ data, loading = false, peakDay = 0, onPlayToggle }: SIRChartProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(data.length > 0 ? data.length - 1 : 0);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.length > 0) {
      setEndIndex(data.length - 1);
    }
  }, [data]);

  const handleZoom = useCallback((direction: 'in' | 'out', amount: number = 5) => {
    setStartIndex(prev => Math.max(0, prev + (direction === 'in' ? amount : -amount)));
    setEndIndex(prev => Math.min(data.length - 1, prev - (direction === 'in' ? amount : -amount)));
  }, [data.length]);

  const handlePan = useCallback((direction: 'left' | 'right', amount: number = 10) => {
    setStartIndex(prev => {
      const newStart = direction === 'left' ? Math.max(0, prev - amount) : Math.min(data.length - 10, prev + amount);
      return newStart;
    });
    setEndIndex(prev => {
      const newEnd = direction === 'left' ? Math.max(10, prev - amount) : Math.min(data.length - 1, prev + amount);
      return newEnd;
    });
  }, [data.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePan('left');
      if (e.key === 'ArrowRight') handlePan('right');
      if (e.key === '=' || e.key === '+') handleZoom('in');
      if (e.key === '-') handleZoom('out');
      if (e.key === ' ' && onPlayToggle) {
        e.preventDefault();
        onPlayToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePan, handleZoom, onPlayToggle]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) handleZoom('in', 2);
    else handleZoom('out', 2);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-textSecondary">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-action-primary/30 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-action-primary rounded-full animate-spin" />
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
    <div className="w-full h-full flex flex-col gap-3 group" ref={chartRef} onWheel={handleWheel}>
      {/* Legend and Hints */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <ChartLegend />
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] bg-bg-surface border border-bg-border px-2 py-0.5 rounded text-textMuted font-mono">← → Pan</span>
          <span className="text-[10px] bg-bg-surface border border-bg-border px-2 py-0.5 rounded text-textMuted font-mono">+/- Zoom</span>
          <span className="text-[10px] bg-bg-surface border border-bg-border px-2 py-0.5 rounded text-textMuted font-mono">Space Play</span>
        </div>

        {peakDay > 0 && (
          <span className="text-xs font-mono text-action-danger/80">
            ⚠ Peak: Day {peakDay}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sir-susceptible)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--sir-susceptible)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sir-infected)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="var(--sir-infected)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sir-recovered)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--sir-recovered)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--bg-border)"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickFormatter={formatXAxis}
              stroke="var(--bg-border)"
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--bg-border)' }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              stroke="var(--bg-border)"
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              width={52}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--bg-border)', strokeWidth: 1 }} />

            {peakDay > 0 && (
              <ReferenceLine
                x={peakDay}
                stroke="var(--sir-infected)"
                strokeDasharray="4 3"
                strokeOpacity={0.5}
                label={{
                  value: 'Peak',
                  position: 'top',
                  fill: 'var(--sir-infected)',
                  fontSize: 10,
                  fontFamily: 'monospace',
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="S"
              name="Susceptible"
              stroke="var(--sir-susceptible)"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#gradS)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--sir-susceptible)', stroke: 'var(--bg-void)', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="R"
              name="Recovered"
              stroke="var(--sir-recovered)"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#gradR)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--sir-recovered)', stroke: 'var(--bg-void)', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="I"
              name="Infected"
              stroke="var(--sir-infected)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#gradI)"
              dot={false}
              activeDot={{ r: 5, fill: 'var(--sir-infected)', stroke: 'var(--bg-void)', strokeWidth: 2 }}
            />

            <Brush
              dataKey="day"
              height={28}
              stroke="var(--bg-border)"
              fill="var(--bg-void)"
              travellerWidth={6}
              tickFormatter={formatXAxis}
              style={{ marginTop: 4 }}
              startIndex={startIndex}
              endIndex={endIndex}
              onChange={(e: any) => {
                if (e.startIndex !== undefined) setStartIndex(e.startIndex);
                if (e.endIndex !== undefined) setEndIndex(e.endIndex);
              }}
            >
              <AreaChart data={data}>
                <Area
                  type="monotone"
                  dataKey="I"
                  stroke="var(--sir-infected)"
                  strokeWidth={1}
                  fill="var(--sir-infected)"
                  fillOpacity={0.15}
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
