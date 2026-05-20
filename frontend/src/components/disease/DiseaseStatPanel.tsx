'use client';

import { Disease } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Activity, TrendingDown, TrendingUp, Calendar,
  Users, AlertTriangle, Heart, BarChart2,
  ChevronRight,
} from 'lucide-react';

interface DiseaseStatPanelProps {
  disease: Disease;
}

function MetricBox({
  label, value, color, icon,
}: {
  label: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-base rounded-xl p-4 border border-border">
      <div className={`flex items-center gap-2 text-body-sm ${color} mb-1`}>
        {icon}
        <span className="text-textMuted">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color} tabular-nums`}>{value}</p>
    </div>
  );
}

function ReadOnlySlider({
  label, value, max = 1, color,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-body-sm text-textSecondary">{label}</span>
        <span className={`text-body-sm font-mono font-bold ${color}`}>{value.toFixed(2)}</span>
      </div>
      <div className="h-1.5 bg-raised rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className={`h-full rounded-full`}
          style={{ background: `currentColor` }}
        />
      </div>
    </div>
  );
}

export default function DiseaseStatPanel({ disease: d }: DiseaseStatPanelProps) {
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  const r0 = d.stats.r0 ?? 0;
  const r0Color = r0 > 2 ? 'text-sir-infected' : r0 > 1 ? 'text-sir-susceptible' : 'text-sir-recovered';

  return (
    <div className="space-y-5">

      {/* Outbreak Status Header */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex w-2.5 h-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sir-infected opacity-60" />
              <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-sir-infected" />
            </span>
            <span className="text-body-sm font-bold text-sir-infected uppercase tracking-widest">
              {d.status === 'active' ? 'Active Outbreak' : d.status === 'contained' ? 'Contained' : 'Resolved'}
            </span>
          </div>
          <span className="text-[11px] text-textMuted font-mono">
            <Calendar className="w-3 h-3 inline mr-1" />
            {new Date(d.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* 2×2 Metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricBox
            label="Total Cases"
            value={fmt(d.stats.totalCases)}
            color="text-sir-infected"
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
          />
          <MetricBox
            label="Active Now"
            value={fmt(d.stats.activeCases)}
            color="text-sir-susceptible"
            icon={<Activity className="w-3.5 h-3.5" />}
          />
          <MetricBox
            label="Recovered"
            value={fmt(d.stats.recovered)}
            color="text-sir-recovered"
            icon={<Heart className="w-3.5 h-3.5" />}
          />
          <MetricBox
            label="Deaths"
            value={fmt(d.stats.deaths)}
            color="text-textSecondary"
            icon={<TrendingDown className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* SIR Parameters */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h3 className="text-body-sm font-semibold text-textSecondary uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4" /> SIR Parameters
        </h3>

        {/* R₀ large display */}
        <div className="flex items-center justify-between bg-base rounded-xl p-4 border border-border mb-4">
          <div>
            <p className="text-body-sm text-textMuted mb-0.5">Basic Reproduction Number</p>
            <p className={`text-display-lg font-bold ${r0Color}`}>{r0.toFixed(1)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-textMuted uppercase">R₀</p>
            <p className={`text-body-sm font-medium ${r0Color}`}>
              {r0 > 2 ? '⚠ High spread' : r0 > 1 ? '~ Moderate' : '✓ Controlled'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-body-sm text-textSecondary">β Transmission rate</span>
              <span className="text-body-sm font-mono font-bold text-sir-infected">{d.sirParams.beta.toFixed(2)}</span>
            </div>
            <div className="h-1.5 bg-raised rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(d.sirParams.beta * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-full bg-sir-infected"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-body-sm text-textSecondary">γ Recovery rate</span>
              <span className="text-body-sm font-mono font-bold text-sir-recovered">{d.sirParams.gamma.toFixed(2)}</span>
            </div>
            <div className="h-1.5 bg-raised rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(d.sirParams.gamma * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full rounded-full bg-sir-recovered"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-[10px] text-textMuted uppercase mb-1">Population (N)</p>
            <p className="text-body-sm font-mono font-bold text-textPrimary">{fmt(d.sirParams.N)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-textMuted uppercase mb-1">Initial Infected (I₀)</p>
            <p className="text-body-sm font-mono font-bold text-textPrimary">{d.sirParams.I0.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Affected Countries */}
      {d.affectedCountries?.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="text-body-sm font-semibold text-textSecondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> Affected Regions ({d.affectedCountries.length})
          </h3>
          <div className="space-y-2">
            {d.affectedCountries.slice(0, 5).map((c) => {
              const maxCases = Math.max(...d.affectedCountries.map(x => x.cases));
              const pct = maxCases > 0 ? (c.cases / maxCases) * 100 : 0;
              const sevColor = c.severity === 'critical' ? 'bg-sir-infected' : c.severity === 'high' ? 'bg-sir-susceptible' : 'bg-sir-recovered';
              return (
                <div key={c.iso} className="flex items-center gap-3">
                  <span className="text-body-sm font-mono font-semibold text-textSecondary w-12 flex-shrink-0">{c.iso}</span>
                  <div className="flex-1 h-1.5 bg-raised rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${sevColor}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-body-sm font-mono text-textMuted w-14 text-right">{fmt(c.cases)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tags */}
      {d.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {d.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-raised border border-border rounded-full text-[11px] font-medium text-textSecondary"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

    </div>
  );
}
