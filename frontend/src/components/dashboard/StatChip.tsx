// frontend/src/components/dashboard/StatChip.tsx
import { ReactNode } from 'react';

type ColorVariant = 'cyan' | 'purple' | 'red' | 'green' | 'yellow' | 'default';

interface StatChipProps {
  label: string;
  value: string | number;
  sub?: string;
  variant?: ColorVariant;
  icon?: ReactNode;
  loading?: boolean;
}

const VARIANTS: Record<ColorVariant, { glow: string; accent: string; text: string }> = {
  cyan:    { glow: 'bg-primary/10',   accent: 'text-primary',   text: 'border-primary/15' },
  purple:  { glow: 'bg-secondary/10', accent: 'text-secondary', text: 'border-secondary/15' },
  red:     { glow: 'bg-danger/10',    accent: 'text-danger',    text: 'border-danger/15' },
  green:   { glow: 'bg-success/10',   accent: 'text-success',   text: 'border-success/15' },
  yellow:  { glow: 'bg-warning/10',   accent: 'text-warning',   text: 'border-warning/15' },
  default: { glow: 'bg-muted/10',     accent: 'text-textSecondary', text: 'border-border' },
};

export default function StatChip({
  label,
  value,
  sub,
  variant = 'default',
  icon,
  loading = false,
}: StatChipProps) {
  const { glow, accent, text } = VARIANTS[variant];

  return (
    <div
      className={`relative bg-surface border ${text} rounded-xl p-4 flex flex-col justify-between overflow-hidden group transition-all duration-200 hover:border-opacity-50`}
    >
      {/* Corner glow orb */}
      <div
        className={`absolute -top-3 -right-3 w-14 h-14 ${glow} rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
      />

      <span className="text-[11px] text-textMuted font-mono uppercase tracking-wider leading-none">
        {label}
      </span>

      <div className="flex items-end justify-between mt-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className={`shrink-0 ${accent}`}>{icon}</span>}
          {loading ? (
            <div className="h-7 w-20 bg-muted/30 rounded animate-pulse" />
          ) : (
            <span className="text-xl font-bold text-white truncate leading-none">{value}</span>
          )}
        </div>
        {sub && !loading && (
          <span className={`text-xs font-mono shrink-0 ${accent}`}>{sub}</span>
        )}
      </div>
    </div>
  );
}
