'use client';

import { ReactNode, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

type ColorVariant = 'blue' | 'yellow' | 'red' | 'green' | 'default';

interface StatChipProps {
  label: string;
  value: number;
  sub?: string;
  subPositive?: boolean;
  variant?: ColorVariant;
  icon?: ReactNode;
  loading?: boolean;
}

const VARIANTS: Record<ColorVariant, {
  glowBg: string; accent: string; border: string; iconBg: string; statGlow: string;
}> = {
  red:     { glowBg: 'bg-sir-infected/10',    accent: 'text-sir-infected',    border: 'border-sir-infected/25',    iconBg: 'bg-sir-infected/10',    statGlow: 'stat-glow-red' },
  yellow:  { glowBg: 'bg-sir-susceptible/10', accent: 'text-sir-susceptible', border: 'border-sir-susceptible/25', iconBg: 'bg-sir-susceptible/10', statGlow: 'stat-glow-yellow' },
  green:   { glowBg: 'bg-sir-recovered/10',   accent: 'text-sir-recovered',   border: 'border-sir-recovered/25',   iconBg: 'bg-sir-recovered/10',   statGlow: 'stat-glow-green' },
  blue:    { glowBg: 'bg-action-primary/10',  accent: 'text-action-primary',  border: 'border-action-primary/25',  iconBg: 'bg-action-primary/10',  statGlow: 'stat-glow-blue' },
  default: { glowBg: 'bg-raised',             accent: 'text-textSecondary',   border: 'border-border',             iconBg: 'bg-raised',             statGlow: '' },
};

function formatValue(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export default function StatChip({
  label,
  value,
  sub,
  subPositive = true,
  variant = 'default',
  icon,
  loading = false,
}: StatChipProps) {
  const { glowBg, accent, border, iconBg, statGlow } = VARIANTS[variant];

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => formatValue(Math.round(latest)));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2.0, ease: 'easeOut' });
    return controls.stop;
  }, [value, count]);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-surface border ${border} rounded-xl p-5 flex flex-col overflow-hidden group cursor-default`}
    >
      {/* Background glow orb */}
      <div className={`absolute -top-8 -right-8 w-32 h-32 ${glowBg} rounded-full blur-2xl pointer-events-none opacity-50 group-hover:opacity-90 transition-opacity duration-500`} />

      {/* Decorative top line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl`} />

      {/* Top row: label + icon */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-body-sm font-medium text-textSecondary tracking-wide">{label}</span>
        {icon && (
          <span className={`${iconBg} ${accent} p-2 rounded-lg border ${border}`}>
            {icon}
          </span>
        )}
      </div>

      {/* Main value — use a compact font size that fits */}
      <div className="relative z-10">
        {loading ? (
          <div className="h-10 w-28 skeleton rounded-lg" />
        ) : (
          <motion.span
            className={`text-[32px] font-bold font-mono leading-none tabular-nums ${accent} ${statGlow}`}
          >
            {rounded}
          </motion.span>
        )}
      </div>

      {/* Delta badge */}
      {sub && !loading && (
        <div className="mt-3 relative z-10">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
            subPositive
              ? 'bg-sir-recovered/10 text-sir-recovered border-sir-recovered/20'
              : 'bg-sir-infected/10 text-sir-infected border-sir-infected/20'
          }`}>
            {subPositive ? '↑' : '↓'} {sub}
          </span>
        </div>
      )}
    </motion.div>
  );
}
