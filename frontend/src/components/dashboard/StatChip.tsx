import { ReactNode, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

type ColorVariant = 'blue' | 'yellow' | 'red' | 'green' | 'default';

interface StatChipProps {
  label: string;
  value: number;
  sub?: string;
  variant?: ColorVariant;
  icon?: ReactNode;
  loading?: boolean;
}

const VARIANTS: Record<ColorVariant, { glow: string; accent: string; text: string }> = {
  blue:    { glow: 'bg-action-primary/10',   accent: 'text-action-primary',   text: 'border-action-primary/15' },
  yellow:  { glow: 'bg-sir-susceptible/10', accent: 'text-sir-susceptible', text: 'border-sir-susceptible/15' },
  red:     { glow: 'bg-sir-infected/10',    accent: 'text-sir-infected',    text: 'border-sir-infected/15' },
  green:   { glow: 'bg-sir-recovered/10',   accent: 'text-sir-recovered',   text: 'border-sir-recovered/15' },
  default: { glow: 'bg-text-muted/10',     accent: 'text-textSecondary', text: 'border-bg-border' },
};

function formatValue(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export default function StatChip({
  label,
  value,
  sub,
  variant = 'default',
  icon,
  loading = false,
}: StatChipProps) {
  const { glow, accent, text } = VARIANTS[variant];
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => formatValue(Math.round(latest)));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return (
    <div
      className={`relative bg-bg-surface border ${text} rounded-xl p-5 flex flex-col justify-between overflow-hidden group transition-all duration-200 hover:border-opacity-50`}
    >
      <div
        className={`absolute -top-3 -right-3 w-16 h-16 ${glow} rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
      />

      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] text-textSecondary font-semibold tracking-wide">
          {label}
        </span>
        {icon && <span className={`shrink-0 ${accent}`}>{icon}</span>}
      </div>

      <div className="flex items-end justify-between mt-1 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {loading ? (
            <div className="h-10 w-24 bg-bg-border rounded animate-pulse" />
          ) : (
            <motion.span className={`text-display-xl font-bold ${accent} leading-none truncate`}>
              {rounded}
            </motion.span>
          )}
        </div>
      </div>
      
      {sub && !loading && (
        <div className="mt-2 flex items-center gap-1">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-action-success/10 text-action-success border border-action-success/20">
            {sub}
          </span>
        </div>
      )}
    </div>
  );
}
