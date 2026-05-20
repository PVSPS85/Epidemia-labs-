import { Disease } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Activity, ShieldAlert, ArrowRight, FlaskConical } from 'lucide-react';

const severityConfig = {
  critical: {
    color: 'text-sir-infected',
    bg: 'bg-sir-infected/10',
    border: 'border-sir-infected/30',
    glow: 'hover:shadow-glow-red',
    dotColor: 'bg-sir-infected',
  },
  high: {
    color: 'text-action-warning',
    bg: 'bg-action-warning/10',
    border: 'border-action-warning/30',
    glow: 'hover:shadow-glow-yellow',
    dotColor: 'bg-action-warning',
  },
  moderate: {
    color: 'text-sir-susceptible',
    bg: 'bg-sir-susceptible/10',
    border: 'border-sir-susceptible/30',
    glow: 'hover:shadow-glow-yellow',
    dotColor: 'bg-sir-susceptible',
  },
  low: {
    color: 'text-sir-recovered',
    bg: 'bg-sir-recovered/10',
    border: 'border-sir-recovered/30',
    glow: 'hover:shadow-glow-green',
    dotColor: 'bg-sir-recovered',
  },
};

function SIRSparkline({ r0 }: { r0: number }) {
  // Generate a mini bell-curve sparkline from R0 value
  const points = Array.from({ length: 24 }, (_, i) => {
    const peak = 12;
    const spread = 4 + r0;
    return Math.exp(-0.5 * Math.pow((i - peak) / spread, 2)) * 100;
  });
  const max = Math.max(...points);
  return (
    <div className="h-[52px] w-full bg-base rounded-lg border border-border flex items-end gap-px p-1 overflow-hidden">
      {points.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-sir-infected/60 transition-all"
          style={{ height: `${(h / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function DiseaseCard({ disease }: { disease: Disease }) {
  const sev = severityConfig[disease.severity] ?? severityConfig.low;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`group flex flex-col bg-surface border border-border rounded-xl overflow-hidden ${sev.glow} hover:border-action-primary transition-all duration-200`}
    >
      {/* Cover image */}
      <div className="relative h-[160px] w-full bg-raised flex-shrink-0">
        {disease.coverImage ? (
          <img
            src={disease.coverImage}
            alt={disease.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Activity className="w-10 h-10 text-textMuted opacity-30" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

        {/* Classification badge — top left */}
        <span className="absolute top-3 left-3 bg-base/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-semibold text-textSecondary uppercase tracking-wider border border-border">
          {disease.classification}
        </span>

        {/* Severity badge — top right */}
        <span className={`absolute top-3 right-3 ${sev.bg} ${sev.color} ${sev.border} px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1`}>
          <ShieldAlert className="w-3 h-3" />
          {disease.severity}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-heading-md font-semibold text-textPrimary leading-tight mb-1">
          {disease.name}
        </h3>
        <p className="text-body-sm text-textSecondary capitalize mb-4">
          {disease.pathogenType} &bull; {disease.affectedCountries?.[0]?.iso || 'Global'}
        </p>

        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-1 mb-4">
          {[
            { label: 'Cases', value: disease.stats.totalCases >= 1_000_000 ? `${(disease.stats.totalCases/1_000_000).toFixed(1)}M` : `${(disease.stats.totalCases/1_000).toFixed(0)}K`, color: 'text-sir-infected' },
            { label: 'R₀',    value: disease.stats.r0.toFixed(1), color: 'text-sir-susceptible' },
            { label: 'CFR',   value: `${disease.stats.cfr}%`,     color: 'text-textPrimary' },
            { label: 'Days',  value: String(disease.sirParams?.days ?? 120), color: 'text-textMuted' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-[9px] text-textMuted uppercase tracking-wider">{label}</span>
              <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Sparkline */}
        <div className="mb-4">
          <SIRSparkline r0={disease.stats.r0} />
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
            title="Simulate"
          >
            <FlaskConical className="w-4 h-4 text-textMuted group-hover/sim:text-action-primary transition-colors" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
