'use client';

import { Disease } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Activity, ShieldAlert, ArrowRight, FlaskConical, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const severityConfig = {
  critical: {
    color: 'text-sir-infected',
    bg: 'bg-sir-infected/10',
    border: 'border-sir-infected/30',
    glow: 'hover:shadow-glow-red hover:border-sir-infected/50',
    dotColor: 'bg-sir-infected',
    accent: '#EF4444',
  },
  high: {
    color: 'text-action-warning',
    bg: 'bg-action-warning/10',
    border: 'border-action-warning/30',
    glow: 'hover:shadow-glow-yellow hover:border-action-warning/50',
    dotColor: 'bg-action-warning',
    accent: '#F59E0B',
  },
  moderate: {
    color: 'text-sir-susceptible',
    bg: 'bg-sir-susceptible/10',
    border: 'border-sir-susceptible/30',
    glow: 'hover:shadow-glow-yellow hover:border-sir-susceptible/50',
    dotColor: 'bg-sir-susceptible',
    accent: '#F59E0B',
  },
  low: {
    color: 'text-sir-recovered',
    bg: 'bg-sir-recovered/10',
    border: 'border-sir-recovered/30',
    glow: 'hover:shadow-glow-green hover:border-sir-recovered/50',
    dotColor: 'bg-sir-recovered',
    accent: '#10B981',
  },
};

function SIRSparkline({ r0, accent }: { r0: number; accent: string }) {
  const points = Array.from({ length: 28 }, (_, i) => {
    const peak = 14;
    const spread = 4 + r0;
    return Math.exp(-0.5 * Math.pow((i - peak) / spread, 2)) * 100;
  });
  const max = Math.max(...points);
  return (
    <div className="h-[44px] w-full bg-base rounded-lg border border-border flex items-end gap-px p-1.5 overflow-hidden">
      {points.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-300"
          style={{
            height: `${(h / max) * 100}%`,
            backgroundColor: accent,
            opacity: 0.5 + (h / max) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function formatCases(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

export default function DiseaseCard({ disease }: { disease: Disease }) {
  const sev = severityConfig[disease.severity] ?? severityConfig.low;
  const [imgError, setImgError] = useState(false);

  const publishedDate = disease.publishedAt
    ? new Date(disease.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`group flex flex-col bg-surface border border-border rounded-xl overflow-hidden ${sev.glow} transition-all duration-200`}
    >
      {/* Cover image */}
      <div className="relative h-[160px] w-full bg-raised flex-shrink-0">
        {disease.coverImage && !imgError ? (
          <img
            src={disease.coverImage}
            alt={disease.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-base via-raised to-overlay">
            <Activity className="w-10 h-10 text-textMuted opacity-20 mb-2" />
            <span className="text-[10px] font-mono text-textMuted uppercase opacity-40 tracking-widest">{disease.pathogenType}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />

        {/* Top badges */}
        <span className="absolute top-3 left-3 bg-base/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-semibold text-textSecondary uppercase tracking-wider border border-border">
          {disease.classification}
        </span>
        <span className={`absolute top-3 right-3 ${sev.bg} ${sev.color} ${sev.border} px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5`}>
          <ShieldAlert className="w-3 h-3" />
          {disease.severity}
        </span>

        {/* Live pulse dot if active */}
        {disease.status === 'active' && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sir-infected opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sir-infected" />
            </span>
            <span className="text-[10px] text-sir-infected font-semibold uppercase tracking-wider">Active</span>
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title + date */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-heading-md font-semibold text-textPrimary leading-tight group-hover:text-gradient-blue transition-colors">
            {disease.name}
          </h3>
          {publishedDate && (
            <span className="text-[10px] text-textMuted whitespace-nowrap mt-0.5">{publishedDate}</span>
          )}
        </div>
        <p className="text-body-sm text-textMuted capitalize mb-4">
          {disease.pathogenType} · {disease.affectedCountries?.[0]?.iso || 'Global'}
        </p>

        {/* Mini stats row */}
        <div className="grid grid-cols-4 gap-1 mb-3">
          {[
            { label: 'Cases', value: formatCases(disease.stats.totalCases), color: 'text-sir-infected' },
            { label: 'R₀',    value: disease.stats.r0.toFixed(1),           color: 'text-sir-susceptible' },
            { label: 'CFR',   value: `${disease.stats.cfr}%`,               color: 'text-textPrimary' },
            { label: 'Days',  value: String(disease.sirParams?.days ?? 120), color: 'text-textMuted' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center bg-base border border-border rounded-md py-1.5">
              <span className="text-[9px] text-textMuted uppercase tracking-wider mb-0.5">{label}</span>
              <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Sparkline */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-textMuted uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Spread curve (R₀ = {disease.stats.r0})
            </span>
          </div>
          <SIRSparkline r0={disease.stats.r0} accent={sev.accent} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <Link
            href={`/disease/${disease.id}`}
            className="flex-1 bg-action-primary/10 hover:bg-action-primary/20 text-action-primary border border-action-primary/30 py-2 rounded-lg text-body-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            Read Article <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/disease/${disease.id}?simulate=true`}
            className="w-10 h-10 bg-base border border-border hover:border-action-primary hover:bg-action-primary/10 rounded-lg flex items-center justify-center transition-colors group/sim"
            title="Run Simulation"
          >
            <FlaskConical className="w-4 h-4 text-textMuted group-hover/sim:text-action-primary transition-colors" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
