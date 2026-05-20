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

const VARIANTS: Record<ColorVariant, { glowBg: string; accent: string; border: string; iconBg: string }> = {
  red:     { glowBg: 'bg-sir-infected/10',    accent: 'text-sir-infected',    border: 'border-sir-infected/20',    iconBg: 'bg-sir-infected/10' },
  yellow:  { glowBg: 'bg-sir-susceptible/10', accent: 'text-sir-susceptible', border: 'border-sir-susceptible/20', iconBg: 'bg-sir-susceptible/10' },
  green:   { glowBg: 'bg-sir-recovered/10',   accent: 'text-sir-recovered',   border: 'border-sir-recovered/20',   iconBg: 'bg-sir-recovered/10' },
  blue:    { glowBg: 'bg-action-primary/10',  accent: 'text-action-primary',  border: 'border-action-primary/20',  iconBg: 'bg-action-primary/10' },
  default: { glowBg: 'bg-raised',             accent: 'text-textSecondary',   border: 'border-border',             iconBg: 'bg-raised' },
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
  const { glowBg, accent, border, iconBg } = VARIANTS[variant];

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => formatValue(Math.round(latest)));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.8, ease: 'easeOut' });
    return controls.stop;
  }, [value, count]);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-surface border ${border} rounded-xl p-5 flex flex-col overflow-hidden group cursor-default`}
    >
      {/* Background glow orb */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 ${glowBg} rounded-full blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Top row: label + icon */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-body-sm font-medium text-textSecondary">{label}</span>
        {icon && (
          <span className={`${iconBg} ${accent} p-2 rounded-lg`}>
            {icon}
          </span>
        )}
      </div>

      {/* Main value */}
      <div className="relative z-10">
        {loading ? (
          <div className="h-12 w-32 skeleton rounded-lg" />
        ) : (
          <motion.span className={`text-display-xl font-bold ${accent} leading-none tabular-nums`}>
            {rounded}
          </motion.span>
        )}
      </div>

      {/* Delta badge */}
      {sub && !loading && (
        <div className="mt-3 relative z-10">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
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
