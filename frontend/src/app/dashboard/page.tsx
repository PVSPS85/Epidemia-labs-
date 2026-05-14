'use client';

import { useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useSimulationStore } from '@/store/simulationStore';
import { SimulationResult } from '@/types';
import StatChip from '@/components/dashboard/StatChip';
import SIRChart from '@/components/dashboard/SIRChart';
import {
  Play,
  Pause,
  RotateCcw,
  Users,
  TrendingUp,
  AlertTriangle,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';

/* ── Simulation Parameter Slider ─────────────────────────────────────────── */
function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-textSecondary font-mono">{label}</span>
        <span className="text-xs font-bold text-primary font-mono">{format(value)}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1 cursor-pointer"
          style={{
            background: `linear-gradient(to right, #00D1FF ${pct}%, #1C212B ${pct}%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-textMuted font-mono">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

/* ── Main Dashboard Page ─────────────────────────────────────────────────── */
export default function DashboardPage() {
  const {
    population, r0, days, model, results, isLoading, peakInfected, peakDay,
    totalRecovered, activeInfected,
    setPopulation, setR0, setDays, setModel, setResults, setLoading, setError, computePeaks,
  } = useSimulationStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'30D' | '60D' | '90D' | '120D'>('120D');

  /* Run the simulation */
  const runSimulation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.runSimulation({ population, r0, days });
      const data = res.data as SimulationResult[];
      setResults(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  }, [population, r0, days, setLoading, setError, setResults]);

  /* Auto-run on mount */
  useEffect(() => {
    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Recompute peaks whenever r0/population/days change */
  useEffect(() => {
    computePeaks();
  }, [results, computePeaks]);

  /* Filter results by selected time range */
  const rangeMap = { '30D': 30, '60D': 60, '90D': 90, '120D': 120 };
  const chartData = results.filter((d) => d.day <= (rangeMap[selectedRange] ?? days));

  const growthRate = r0 > 1 ? `+${((r0 - 1) * 100).toFixed(0)}%` : `${((r0 - 1) * 100).toFixed(0)}%`;
  const fmtPop = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(0)}K`;

  return (
    <div className="h-full flex flex-col p-6 gap-5">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Global Epidemic Analytics
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] bg-success/15 text-success border border-success/25 font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-textSecondary text-sm mt-0.5">
            Real-time epidemiological modelling and predictive outbreak engine.
          </p>
        </div>

        {/* Controls bar */}
        <div className="flex items-center gap-3">
          {/* Model selector */}
          <div className="flex bg-surface border border-border rounded-lg p-0.5">
            {(['SIR', 'SEIR'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  model === m
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-textSecondary hover:text-white'
                }`}
              >
                {m} Model
              </button>
            ))}
          </div>

          {/* Play / Reset */}
          <button
            id="sim-play"
            onClick={() => {
              setIsPlaying(!isPlaying);
              if (!isPlaying) runSimulation();
            }}
            className="w-9 h-9 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 border border-primary/20 flex items-center justify-center transition-all"
            title={isPlaying ? 'Pause' : 'Run simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            id="sim-reset"
            onClick={runSimulation}
            disabled={isLoading}
            className="w-9 h-9 rounded-lg bg-surface border border-border text-textSecondary hover:text-white hover:border-border/80 flex items-center justify-center transition-all disabled:opacity-50"
            title="Re-run simulation"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* ── Stats Strip ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 shrink-0">
        <StatChip
          label="Population (N)"
          value={fmtPop(population)}
          variant="cyan"
          icon={<Users className="w-4 h-4" />}
          loading={isLoading}
        />
        <StatChip
          label="Reproduction Rate (R₀)"
          value={r0.toFixed(2)}
          sub={growthRate}
          variant="purple"
          icon={<TrendingUp className="w-4 h-4" />}
          loading={isLoading}
        />
        <StatChip
          label="Peak Infection Day"
          value={`Day ${peakDay}`}
          sub={fmtPop(peakInfected)}
          variant="red"
          icon={<AlertTriangle className="w-4 h-4" />}
          loading={isLoading}
        />
        <StatChip
          label="Total Recovered"
          value={fmtPop(totalRecovered)}
          variant="green"
          icon={<CheckCircle2 className="w-4 h-4" />}
          loading={isLoading}
        />
        <StatChip
          label="Active Infected"
          value={fmtPop(activeInfected)}
          variant="yellow"
          icon={<Activity className="w-4 h-4" />}
          loading={isLoading}
        />
      </div>

      {/* ── Main content row: Chart + Controls ─────────────────────────── */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Chart panel */}
        <div className="flex-1 bg-surface border border-border rounded-2xl p-5 flex flex-col min-h-0">
          {/* Chart header */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              SIR Epidemic Curve
              {model === 'SEIR' && (
                <span className="text-[10px] px-1.5 py-0.5 bg-secondary/20 text-secondary rounded border border-secondary/30">
                  SEIR (soon)
                </span>
              )}
            </h3>

            {/* Time range chips */}
            <div className="flex items-center gap-1 bg-background rounded-lg p-0.5 border border-border">
              {(['30D', '60D', '90D', '120D'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRange(r)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all ${
                    selectedRange === r
                      ? 'bg-surface text-primary'
                      : 'text-textMuted hover:text-textSecondary'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 min-h-0">
            <SIRChart data={chartData} loading={isLoading} peakDay={peakDay} />
          </div>
        </div>

        {/* Simulation controls panel */}
        <div className="w-64 shrink-0 flex flex-col gap-3">
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider mb-1">
                Simulation Parameters
              </h4>
              <p className="text-[11px] text-textMuted">
                Adjust and click Run to model a new scenario.
              </p>
            </div>

            <div className="space-y-5">
              <ParamSlider
                label="Population (N)"
                value={population}
                min={10_000}
                max={10_000_000}
                step={10_000}
                format={(v) => fmtPop(v)}
                onChange={setPopulation}
              />
              <ParamSlider
                label="Reproduction Rate (R₀)"
                value={r0}
                min={0.5}
                max={8}
                step={0.1}
                format={(v) => v.toFixed(1)}
                onChange={setR0}
              />
              <ParamSlider
                label="Simulation Days"
                value={days}
                min={30}
                max={365}
                step={5}
                format={(v) => `${v}d`}
                onChange={setDays}
              />
            </div>

            <button
              id="run-simulation"
              onClick={runSimulation}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-glow-cyan hover:shadow-[0_0_20px_rgba(0,209,255,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><RotateCcw className="w-4 h-4 animate-spin" /> Computing...</>
              ) : (
                <><Play className="w-4 h-4" /> Run Simulation</>
              )}
            </button>
          </div>

          {/* R₀ context card */}
          <div className="bg-surface border border-border rounded-2xl p-4 text-xs space-y-2">
            <p className="text-textSecondary font-mono text-[10px] uppercase tracking-wider">
              R₀ Interpretation
            </p>
            {[
              { range: '< 1.0', desc: 'Controlled — epidemic declines', color: 'text-success' },
              { range: '1.0–2.0', desc: 'Moderate spread', color: 'text-warning' },
              { range: '2.0–4.0', desc: 'High transmission', color: 'text-danger' },
              { range: '> 4.0', desc: 'Explosive outbreak', color: 'text-danger' },
            ].map(({ range, desc, color }) => (
              <div key={range} className="flex items-start gap-2">
                <span className={`font-mono font-bold shrink-0 ${color}`}>{range}</span>
                <span className="text-textMuted">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
