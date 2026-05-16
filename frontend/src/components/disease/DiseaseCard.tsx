import { Disease } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Activity, ShieldAlert, ArrowRight } from 'lucide-react';

const severityConfig = {
  critical: { color: 'text-action-danger', glow: 'shadow-glow-red', bg: 'bg-action-danger/10', border: 'border-action-danger/30' },
  high: { color: 'text-action-warning', glow: 'shadow-glow-yellow', bg: 'bg-action-warning/10', border: 'border-action-warning/30' },
  moderate: { color: 'text-sir-susceptible', glow: 'shadow-glow-yellow', bg: 'bg-sir-susceptible/10', border: 'border-sir-susceptible/30' },
  low: { color: 'text-action-success', glow: 'shadow-glow-green', bg: 'bg-action-success/10', border: 'border-action-success/30' }
};

export default function DiseaseCard({ disease }: { disease: Disease }) {
  const sev = severityConfig[disease.severity];
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4 }}
      className={`group w-full max-w-[320px] bg-bg-surface border border-bg-border rounded-xl overflow-hidden hover:border-action-primary transition-all duration-200 hover:shadow-glow-blue flex flex-col`}
    >
      {/* Header Image */}
      <div className="relative h-[160px] w-full bg-surface-2">
        {disease.coverImage ? (
          <img src={disease.coverImage} alt={disease.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <Activity className="w-12 h-12 text-textMuted" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-surface to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 bg-bg-surface/80 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-textPrimary uppercase tracking-wider border border-bg-border">
          {disease.classification}
        </div>
        <div className={`absolute top-3 right-3 ${sev.bg} ${sev.color} ${sev.border} px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border flex items-center gap-1 ${disease.severity === 'critical' ? sev.glow : ''}`}>
          <ShieldAlert className="w-3 h-3" />
          {disease.severity}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-textPrimary leading-tight mb-1">{disease.name}</h3>
        <p className="text-sm text-textSecondary capitalize">
          {disease.pathogenType} • {disease.affectedCountries?.[0]?.iso || 'Global'}
        </p>

        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-2 mt-4 mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-textMuted uppercase">Cases</span>
            <span className="text-xs font-mono text-action-danger font-semibold">{(disease.stats.totalCases / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-textMuted uppercase">R₀</span>
            <span className="text-xs font-mono text-action-warning font-semibold">{disease.stats.r0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-textMuted uppercase">CFR</span>
            <span className="text-xs font-mono text-textPrimary font-semibold">{disease.stats.cfr}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-textMuted uppercase">Days</span>
            <span className="text-xs font-mono text-textPrimary font-semibold">{(disease.sirParams.days || 120)}</span>
          </div>
        </div>

        {/* Sparkline (mini SIR curve representation) */}
        <div className="h-[60px] w-full mt-auto bg-bg-base rounded-md border border-bg-border flex items-end p-1 gap-0.5 overflow-hidden relative">
          {/* Mock sparkline since actual charting requires real data */}
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex-1 bg-action-danger/50 rounded-t-sm" style={{ height: `${Math.sin(i / 3) * 40 + 40}%` }} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/50 to-transparent pointer-events-none" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-5">
          <Link href={`/disease/${disease.id}`} className="flex-1 bg-action-primary/10 hover:bg-action-primary/20 text-action-primary border border-action-primary/30 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
            Read Article <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href={`/disease/${disease.id}?simulate=true`} className="w-10 h-10 bg-bg-base border border-bg-border hover:border-action-primary hover:text-action-primary rounded-lg flex items-center justify-center transition-colors">
            ⚗️
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
