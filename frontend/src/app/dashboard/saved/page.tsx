'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useDiseaseStore } from '@/store/diseaseStore';
import DiseaseCard from '@/components/disease/DiseaseCard';
import { motion } from 'framer-motion';
import { Bookmark, Stethoscope, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
  const { user } = useAuthStore();
  const { diseases, fetchDiseases, isLoading } = useDiseaseStore();

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const savedIds = user?.savedDiseases || [];
  const savedDiseases = diseases.filter(d => savedIds.includes(d.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1400px] mx-auto pb-16 space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-display-lg font-bold flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-action-primary" />
          Saved Research
        </h1>
        <p className="text-body-lg text-textSecondary mt-2">
          Your bookmarked diseases and research articles for quick access.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 skeleton rounded-2xl" />
          ))}
        </div>
      ) : savedDiseases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedDiseases.map((disease, i) => (
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
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-raised rounded-2xl flex items-center justify-center mb-6 border border-border">
            <Bookmark className="w-10 h-10 text-textMuted" />
          </div>
          <h3 className="text-heading-lg font-semibold text-textPrimary mb-2">No Saved Research</h3>
          <p className="text-body-md text-textSecondary max-w-md mb-8">
            You haven&apos;t saved any diseases yet. Browse the disease database and bookmark items to see them here for quick reference.
          </p>
          <Link
            href="/dashboard/diseases"
            className="flex items-center gap-2 px-6 py-3 bg-action-primary hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors shadow-glow-blue"
          >
            <Stethoscope className="w-4 h-4" />
            Browse Diseases
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </motion.div>
  );
}
