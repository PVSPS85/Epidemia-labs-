'use client';

import { useState, useEffect } from 'react';
import { useDiseaseStore } from '@/store/diseaseStore';
import DiseaseCard from '@/components/disease/DiseaseCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Search, ServerCrash, RefreshCw, Loader2 } from 'lucide-react';

const PATHOGEN_FILTERS = ['All', 'Virus', 'Bacteria', 'Fungal', 'Prion', 'Parasite'] as const;
const SEVERITY_FILTERS = ['All', 'Critical', 'High', 'Moderate', 'Low'] as const;

function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="h-[160px] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-2/3 skeleton rounded" />
        <div className="h-4 w-1/2 skeleton rounded" />
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[1,2,3,4].map(i => <div key={i} className="h-8 skeleton rounded" />)}
        </div>
        <div className="h-12 skeleton rounded-lg" />
        <div className="h-9 skeleton rounded-lg" />
      </div>
    </div>
  );
}

export default function DiseasesPage() {
  const { diseases, fetchDiseases, isLoading, error } = useDiseaseStore();
  const [query, setQuery] = useState('');
  const [pathogenFilter, setPathogenFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const filtered = diseases.filter((d) => {
    const matchesQuery =
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      (d.article?.abstract ?? '').toLowerCase().includes(query.toLowerCase());
    const matchesPathogen =
      pathogenFilter === 'All' ||
      d.pathogenType?.toLowerCase() === pathogenFilter.toLowerCase();
    const matchesSeverity =
      severityFilter === 'All' ||
      d.severity?.toLowerCase() === severityFilter.toLowerCase();
    return matchesQuery && matchesPathogen && matchesSeverity;
  });

  return (
    <div className="max-w-[1400px] mx-auto pb-16 space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-action-primary/10 border border-action-primary/20 flex items-center justify-center text-action-primary">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-heading-xl font-bold text-textPrimary">Disease Database</h2>
            <p className="text-body-sm text-textSecondary">
              {isLoading ? 'Loading…' : `${filtered.length} pathogen profile${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
          <input
            type="text"
            placeholder="Search diseases…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-full py-2 pl-10 pr-4 text-body-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6">
        {/* Pathogen type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-body-sm text-textMuted font-medium mr-1">Type:</span>
          {PATHOGEN_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setPathogenFilter(f)}
              className={`px-3 py-1 rounded-full text-body-sm font-medium transition-all ${
                pathogenFilter === f
                  ? 'bg-action-primary text-white'
                  : 'bg-raised border border-border text-textSecondary hover:text-textPrimary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Severity */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-body-sm text-textMuted font-medium mr-1">Severity:</span>
          {SEVERITY_FILTERS.map(f => {
            const colors: Record<string, string> = {
              Critical: 'bg-sir-infected text-white',
              High:     'bg-action-warning text-white',
              Moderate: 'bg-sir-susceptible text-void',
              Low:      'bg-sir-recovered text-void',
            };
            return (
              <button
                key={f}
                onClick={() => setSeverityFilter(f)}
                className={`px-3 py-1 rounded-full text-body-sm font-medium transition-all ${
                  severityFilter === f
                    ? (colors[f] ?? 'bg-action-primary text-white')
                    : 'bg-raised border border-border text-textSecondary hover:text-textPrimary'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-raised rounded-2xl flex items-center justify-center mb-4 border border-border">
              <ServerCrash className="w-8 h-8 text-textMuted" />
            </div>
            <h3 className="text-heading-md font-semibold text-textPrimary mb-2">Failed to load database</h3>
            <p className="text-body-md text-textSecondary mb-6 max-w-sm">{error}</p>
            <button
              onClick={fetchDiseases}
              className="flex items-center gap-2 px-5 py-2.5 bg-action-primary/10 hover:bg-action-primary/20 text-action-primary border border-action-primary/30 rounded-lg text-body-sm font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Database className="w-12 h-12 text-textMuted opacity-30 mb-4" />
            <p className="text-body-md text-textMuted">No diseases match your current filters.</p>
            <button
              onClick={() => { setQuery(''); setPathogenFilter('All'); setSeverityFilter('All'); }}
              className="mt-4 text-body-sm text-action-primary hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {filtered.map((disease, i) => (
              <motion.div
                key={disease.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <DiseaseCard disease={disease} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
