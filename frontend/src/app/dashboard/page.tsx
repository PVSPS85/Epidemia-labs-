'use client';

import { useEffect, useState } from 'react';
import { useDiseaseStore } from '@/store/diseaseStore';
import DiseaseCard from '@/components/disease/DiseaseCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ServerCrash, RefreshCw, BookOpen, ArrowRight,
  TrendingUp, Globe
} from 'lucide-react';
import Link from 'next/link';

const FILTER_TABS = ['All', 'Pandemic', 'Epidemic', 'Endemic', 'Outbreak', 'Contained'] as const;
type FilterTab = typeof FILTER_TABS[number];

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

function EmptyState({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-raised rounded-2xl flex items-center justify-center mb-4 border border-border">
        <ServerCrash className="w-8 h-8 text-textMuted" />
      </div>
      <h3 className="text-heading-md font-semibold text-textPrimary mb-2">
        {error ? 'Failed to load diseases' : 'No diseases found'}
      </h3>
      <p className="text-body-md text-textSecondary max-w-sm mb-6">
        {error || 'No diseases match the current filter. Try a different category.'}
      </p>
      {error && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-action-primary/10 hover:bg-action-primary/20 text-action-primary border border-action-primary/30 rounded-lg text-body-sm font-semibold transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Retry Connection
        </button>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { diseases, fetchDiseases, isLoading, error } = useDiseaseStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  // Filter diseases
  const filteredDiseases = activeTab === 'All'
    ? diseases
    : activeTab === 'Contained'
    ? diseases.filter(d => d.status === 'contained')
    : diseases.filter(d => d.classification === activeTab.toLowerCase());

  return (
    <div className="max-w-[1400px] mx-auto pb-16 space-y-10">

      {/* ── ACTIVE OUTBREAK FEED ── */}
      <section>
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-heading-xl font-bold flex items-center gap-3">
            Active Outbreak Feed
            <span className="relative flex items-center gap-1.5 ml-1">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-sir-infected opacity-60" />
              <span className="relative w-2.5 h-2.5 rounded-full bg-sir-infected" />
              <span className="text-body-sm font-semibold text-sir-infected uppercase tracking-wider">Live</span>
            </span>
          </h2>
          <span className="text-body-sm text-textMuted">
            {isLoading ? '—' : `${filteredDiseases.length} outbreak${filteredDiseases.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto scrollbar-hide">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2.5 text-body-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-action-primary'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-action-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Disease grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : error || filteredDiseases.length === 0 ? (
              <div className="grid grid-cols-1">
                <EmptyState error={error} onRetry={fetchDiseases} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredDiseases.map((disease, i) => (
                  <motion.div
                    key={disease.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <DiseaseCard disease={disease} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── TRENDING RESEARCH ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-heading-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-action-primary" />
            Trending Research
          </h2>
          <Link
            href="/dashboard/diseases"
            className="text-body-sm text-action-primary hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 skeleton rounded-xl" />
            ))}
          </div>
        ) : diseases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {diseases.slice(0, 4).map((d, i) => (
              <motion.div
                key={d.id}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href={`/disease/${d.id}`}
                  className="block bg-surface border border-border hover:border-action-primary/50 p-4 rounded-xl transition-colors group"
                >
                  <span className="text-[10px] text-action-primary font-mono uppercase tracking-wider">
                    {d.classification} · {d.pathogenType}
                  </span>
                  <h4 className="text-body-md font-semibold text-textPrimary group-hover:text-action-primary transition-colors leading-snug my-1.5">
                    {d.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-textSecondary">
                    {d.author?.avatar && (
                      <img
                        src={d.author.avatar}
                        alt={d.author.name}
                        className="w-4 h-4 rounded-full"
                      />
                    )}
                    {d.author?.name || 'Epidemia-Labs'}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 border border-dashed border-border rounded-xl">
            <p className="text-body-sm text-textMuted flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Research articles will appear here once published
            </p>
          </div>
        )}
      </section>

      {/* ── GLOBAL ALERT MAP PREVIEW ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-heading-xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-action-primary" />
            Global Alert Map
          </h2>
          <Link
            href="/dashboard/map"
            className="text-body-sm text-action-primary hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            View full map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="h-[240px] bg-surface border border-border rounded-2xl flex items-center justify-center overflow-hidden relative">
          {/* Placeholder that matches the dark ocean aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-br from-void via-base to-overlay" />
          <div className="relative z-10 text-center">
            <Globe className="w-12 h-12 text-action-primary/40 mx-auto mb-3" />
            <p className="text-body-sm text-textMuted">
              Interactive world map loads on the{' '}
              <Link href="/dashboard/map" className="text-action-primary hover:underline">
                Live Map
              </Link>{' '}
              page
            </p>
          </div>
          {/* Decorative hotspot pulses */}
          {diseases.flatMap(d => d.hotspots ?? []).slice(0, 6).map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full bg-sir-infected animate-ping"
              style={{
                left: `${20 + (i * 13)}%`,
                top:  `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.4}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
