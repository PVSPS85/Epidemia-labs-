'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import SIRChart from '@/components/dashboard/SIRChart';
import { motion } from 'framer-motion';
import { Play, BarChart2, Users, Calendar, Activity, Zap } from 'lucide-react';

export default function SimulationsPage() {
  const { results, runSimulation, setParams, isLoading } = useSimulationStore();
  const [r0, setR0] = useState(2.5);
  const [population, setPopulation] = useState(1_000_000);
  const [days, setDays] = useState(120);

  const handleRun = useCallback(() => {
    const gamma = 1 / 14;
    const beta = r0 * gamma;
    setParams({ beta, gamma, N: population, I0: 1, days });
    runSimulation();
  }, [r0, population, days, setParams, runSimulation]);

  useEffect(() => {
    handleRun();
  }, [handleRun]);

  // Compute peak metrics from results
  const peakInfected = results.length > 0 ? Math.max(...results.map(r => r.I)) : 0;
  const peakDay = results.length > 0 ? results.find(r => r.I === peakInfected)?.day || 0 : 0;
  const totalRecovered = results.length > 0 ? results[results.length - 1]?.R || 0 : 0;

  const formatNum = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toFixed(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1400px] mx-auto pb-16 space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-display-lg font-bold flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-action-primary" />
          SIR Epidemic Simulator
        </h1>
        <p className="text-body-lg text-textSecondary mt-2">
          Adjust parameters to model disease spread using the Susceptible-Infected-Recovered compartmental model.
        </p>
      </div>

      {/* Controls Panel */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
        <h2 className="text-heading-md font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-action-primary" />
          Simulation Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* R0 Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-body-sm font-medium text-textSecondary flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Basic Reproduction Number (R₀)
              </label>
              <span className="text-body-sm font-bold text-sir-infected font-mono">{r0.toFixed(1)}</span>
            </div>
            <input
              type="range" min="0.5" max="15" step="0.1" value={r0}
              onChange={(e) => setR0(parseFloat(e.target.value))}
              className="w-full h-2 bg-raised rounded-full appearance-none cursor-pointer accent-sir-infected"
            />
            <div className="flex justify-between text-[10px] text-textMuted font-mono">
              <span>0.5</span><span>15.0</span>
            </div>
          </div>

          {/* Population Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-body-sm font-medium text-textSecondary flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Population
              </label>
              <span className="text-body-sm font-bold text-sir-susceptible font-mono">{formatNum(population)}</span>
            </div>
            <input
              type="range" min="1000" max="10000000" step="10000" value={population}
              onChange={(e) => setPopulation(parseInt(e.target.value))}
              className="w-full h-2 bg-raised rounded-full appearance-none cursor-pointer accent-sir-susceptible"
            />
            <div className="flex justify-between text-[10px] text-textMuted font-mono">
              <span>1K</span><span>10M</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-body-sm font-medium text-textSecondary flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Duration (days)
              </label>
              <span className="text-body-sm font-bold text-textPrimary font-mono">{days}</span>
            </div>
            <input
              type="range" min="30" max="365" step="5" value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full h-2 bg-raised rounded-full appearance-none cursor-pointer accent-action-primary"
            />
            <div className="flex justify-between text-[10px] text-textMuted font-mono">
              <span>30</span><span>365</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={isLoading}
          className="px-6 py-3 bg-action-primary hover:bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-glow-blue disabled:opacity-70"
        >
          <Play className="w-4 h-4 fill-current" />
          {isLoading ? 'Computing...' : 'Run Simulation'}
        </button>
      </div>

      {/* Chart */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-heading-md font-semibold mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-action-primary" />
          SIR Model Results
          {isLoading && (
            <span className="ml-auto text-[11px] text-textMuted font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-action-primary animate-pulse" />
              Computing...
            </span>
          )}
        </h2>
        <div className="h-[500px]">
          <SIRChart data={results} loading={isLoading} onPlayToggle={() => {}} />
        </div>
      </div>

      {/* Key Metrics */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Peak Infected', value: formatNum(peakInfected), color: 'text-sir-infected', glow: 'shadow-glow-red', icon: <Activity className="w-5 h-5" /> },
            { label: 'Peak Day', value: `Day ${peakDay}`, color: 'text-sir-susceptible', glow: 'shadow-glow-yellow', icon: <Calendar className="w-5 h-5" /> },
            { label: 'Total Recovered', value: formatNum(totalRecovered), color: 'text-sir-recovered', glow: 'shadow-glow-green', icon: <Users className="w-5 h-5" /> },
          ].map(({ label, value, color, glow, icon }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`bg-surface border border-border rounded-2xl p-6 text-center ${glow}`}
            >
              <div className={`${color} mx-auto mb-2`}>{icon}</div>
              <p className={`text-2xl font-bold ${color} font-mono`}>{value}</p>
              <p className="text-[11px] text-textMuted mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
