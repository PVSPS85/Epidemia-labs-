'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Disease } from '@/types';
import { Database, Search, AlertCircle, Loader2, Biohazard } from 'lucide-react';

function DiseaseCard({ disease }: { disease: Disease }) {
  const r0Color =
    disease.r0 >= 4 ? 'text-danger border-danger/20 bg-danger/10' :
    disease.r0 >= 2 ? 'text-warning border-warning/20 bg-warning/10' :
    'text-success border-success/20 bg-success/10';

  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:border-border/80 hover:shadow-card transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-secondary/15 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-secondary/25 transition-colors">
            <Biohazard className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-tight">{disease.name}</h3>
            <p className="text-[11px] text-textMuted mt-0.5 font-mono">
              Incubation: {disease.incubation_period_days}d
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold font-mono px-2 py-1 rounded-md border ${r0Color} shrink-0`}>
          R₀ {disease.r0.toFixed(1)}
        </span>
      </div>

      <p className="text-xs text-textSecondary leading-relaxed line-clamp-2 mb-4">
        {disease.description}
      </p>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
        {[
          { label: 'Mortality', value: `${(disease.mortality_rate * 100).toFixed(1)}%` },
          { label: 'Recovery', value: `${disease.recovery_period_days}d` },
          { label: 'Population', value: disease.population >= 1e6
              ? `${(disease.population / 1e6).toFixed(1)}M`
              : `${(disease.population / 1e3).toFixed(0)}K` },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-xs font-bold text-white">{value}</p>
            <p className="text-[10px] text-textMuted mt-0.5 font-mono">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.getDiseases()
      .then((res) => setDiseases(res.data as Disease[]))
      .catch(() => setError('Failed to load disease database.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = diseases.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Disease Database</h2>
          </div>
          <p className="text-textSecondary text-sm mt-0.5">
            {diseases.length} pathogen profiles available.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
          <input
            type="text"
            placeholder="Search diseases..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface border border-border pl-9 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-textMuted focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,209,255,0.08)] transition-all"
          />
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex items-center justify-center h-64 gap-3 text-textSecondary">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="font-mono text-sm">Loading pathogen data...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-danger/10 border border-danger/20 rounded-xl p-4 text-danger">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-textMuted">
          <Database className="w-10 h-10 opacity-40" />
          <p className="font-mono text-sm">No diseases match your search.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <DiseaseCard key={d.id} disease={d} />
          ))}
        </div>
      )}
    </div>
  );
}
