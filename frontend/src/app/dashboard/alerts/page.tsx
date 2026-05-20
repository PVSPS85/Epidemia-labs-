'use client';

import { useEffect } from 'react';
import { useDiseaseStore } from '@/store/diseaseStore';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const SEVERITY_CONFIG = {
  critical: { color: 'text-sir-infected', bg: 'bg-sir-infected/10', border: 'border-sir-infected/30', label: 'CRITICAL', icon: ShieldAlert },
  high:     { color: 'text-sir-susceptible', bg: 'bg-sir-susceptible/10', border: 'border-sir-susceptible/30', label: 'HIGH', icon: AlertTriangle },
  moderate: { color: 'text-action-primary', bg: 'bg-action-primary/10', border: 'border-action-primary/30', label: 'MODERATE', icon: Activity },
  low:      { color: 'text-sir-recovered', bg: 'bg-sir-recovered/10', border: 'border-sir-recovered/30', label: 'LOW', icon: Activity },
};

const TIME_AGO = ['2 hours ago', '5 hours ago', '12 hours ago', '1 day ago', '2 days ago', '3 days ago'];

export default function AlertsPage() {
  const { diseases, fetchDiseases, isLoading } = useDiseaseStore();

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const alerts = diseases.map((d, i) => {
    const sev = d.severity || 'moderate';
    const config = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG.moderate;
    const Icon = config.icon;
    return {
      id: d.id,
      disease: d.name,
      severity: sev,
      config,
      Icon,
      message: `${d.name} outbreak detected with R₀ of ${d.stats?.r0?.toFixed(1) || '?'}. ${d.stats?.activeCases?.toLocaleString() || 0} active cases reported across ${d.affectedCountries?.length || 0} countries.`,
      time: TIME_AGO[i % TIME_AGO.length],
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1400px] mx-auto pb-16 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-lg font-bold flex items-center gap-3">
            <Bell className="w-8 h-8 text-action-primary" />
            Outbreak Alerts
            <span className="relative flex items-center gap-1.5 ml-1">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-sir-infected opacity-60" />
              <span className="relative w-2.5 h-2.5 rounded-full bg-sir-infected" />
              <span className="text-body-sm font-semibold text-sir-infected uppercase tracking-wider">Live</span>
            </span>
          </h1>
          <p className="text-body-lg text-textSecondary mt-2">
            Real-time alerts generated from disease surveillance data.
          </p>
        </div>
        <span className="text-body-sm text-textMuted">{alerts.length} alert{alerts.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Alert List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 skeleton rounded-2xl" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-raised rounded-2xl flex items-center justify-center mb-4 border border-border">
            <Bell className="w-8 h-8 text-textMuted" />
          </div>
          <h3 className="text-heading-md font-semibold text-textPrimary mb-2">No Alerts</h3>
          <p className="text-body-md text-textSecondary max-w-sm">
            No outbreak alerts at this time. The system will notify you when new threats are detected.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link
                href={`/disease/${alert.id}`}
                className={`block bg-surface border ${alert.config.border} rounded-2xl p-5 hover:bg-raised transition-all group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${alert.config.bg} flex items-center justify-center flex-shrink-0`}>
                    <alert.Icon className={`w-5 h-5 ${alert.config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold ${alert.config.color} tracking-widest uppercase`}>
                        {alert.config.label}
                      </span>
                      <span className="text-[10px] text-textMuted">•</span>
                      <span className="text-[10px] text-textMuted">{alert.time}</span>
                    </div>
                    <h3 className="text-body-md font-semibold text-textPrimary group-hover:text-action-primary transition-colors">
                      {alert.disease}
                    </h3>
                    <p className="text-body-sm text-textSecondary mt-1 line-clamp-2">
                      {alert.message}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-textMuted group-hover:text-action-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
