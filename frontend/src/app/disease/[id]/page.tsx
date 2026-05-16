'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDiseaseStore } from '@/store/diseaseStore';
import { useSimulationStore } from '@/store/simulationStore';
import SIRChart from '@/components/dashboard/SIRChart';
import WorldMapPreview from '@/components/disease/WorldMapPreview';
import { 
  Share2, Bookmark, Download, Play, ShieldAlert,
  ChevronRight, MapPin, Calendar, Microscope
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DiseaseDetailPage() {
  const { id } = useParams() as { id: string };
  const { selectedDisease, fetchDiseaseById, isLoading } = useDiseaseStore();
  const { results, runSimulation, setParams } = useSimulationStore();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchDiseaseById(id);
  }, [id, fetchDiseaseById]);

  useEffect(() => {
    if (selectedDisease) {
      setParams({
        beta: selectedDisease.sirParams.beta,
        gamma: selectedDisease.sirParams.gamma,
        N: selectedDisease.sirParams.N,
        I0: selectedDisease.sirParams.I0,
        days: 120
      });
      runSimulation();
    }
  }, [selectedDisease, setParams, runSimulation]);

  if (isLoading || !selectedDisease) {
    return <div className="h-screen w-full flex items-center justify-center text-textMuted">Loading details...</div>;
  }

  const d = selectedDisease;

  return (
    <div className="max-w-[1400px] mx-auto pb-20">
      
      {/* HERO BANNER */}
      <div className="relative h-[380px] w-full rounded-2xl overflow-hidden mb-10 border border-bg-border">
        {d.coverImage ? (
          <img src={d.coverImage} alt={d.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-surface-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent" />
        
        <div className="absolute inset-0 p-10 flex flex-col justify-end">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-textSecondary mb-4">
            <Link href="/dashboard" className="hover:text-textPrimary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/dashboard" className="hover:text-textPrimary transition-colors">Diseases</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-textPrimary">{d.name}</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-display-lg font-bold text-textPrimary leading-none">{d.name}</h1>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-surface-2 border border-bg-border rounded-full text-xs font-semibold text-textSecondary flex items-center gap-1.5 uppercase">
                  <Microscope className="w-3.5 h-3.5" /> {d.pathogenType}
                </span>
                <span className="px-3 py-1 bg-surface-2 border border-bg-border rounded-full text-xs font-semibold text-textSecondary flex items-center gap-1.5 uppercase">
                  <MapPin className="w-3.5 h-3.5" /> {d.affectedCountries?.[0]?.iso || 'Global'}
                </span>
                <span className="px-3 py-1 bg-action-danger/20 border border-action-danger/30 rounded-full text-xs font-bold text-action-danger flex items-center gap-1.5 uppercase shadow-glow-red">
                  <ShieldAlert className="w-3.5 h-3.5" /> {d.severity}
                </span>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <img src={d.author?.avatar || `https://i.pravatar.cc/150?u=${d.author?.id}`} alt="" className="w-10 h-10 rounded-full border border-bg-border" />
                <div>
                  <div className="text-sm font-semibold text-textPrimary">{d.author?.name || 'Dr. Researcher'}</div>
                  <div className="text-xs text-textSecondary flex items-center gap-2">
                    {d.author?.institution || 'Epidemia Institute'} • <Calendar className="w-3 h-3" /> {new Date(d.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-3 bg-surface-2 hover:bg-bg-raised border border-bg-border rounded-xl text-textSecondary hover:text-textPrimary transition-colors shadow-sm">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 bg-surface-2 hover:bg-bg-raised border border-bg-border rounded-xl text-textSecondary hover:text-textPrimary transition-colors shadow-sm">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-3 bg-surface-2 hover:bg-bg-raised border border-bg-border rounded-xl text-textSecondary hover:text-textPrimary transition-colors shadow-sm">
                <Download className="w-5 h-5" />
              </button>
              <button className="px-6 py-3 bg-action-primary hover:bg-blue-600 border border-action-primary/30 rounded-xl text-white font-semibold flex items-center gap-2 transition-colors shadow-glow-blue">
                <Play className="w-4 h-4 fill-current" /> Simulate Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* LEFT COLUMN: Article & Chart (65%) */}
        <div className="w-full lg:w-[65%] space-y-12">
          
          <div className="prose prose-invert max-w-none">
            {/* Abstract */}
            <div className="bg-surface-2 border-l-4 border-l-action-primary p-6 rounded-r-xl italic text-textSecondary mb-8 text-body-lg">
              {d.article?.abstract || 'No abstract available.'}
            </div>

            {/* Body simulation (Markdown to be handled properly, using simple text for now) */}
            <h2 className="text-heading-md font-semibold border-l-4 border-l-action-primary pl-3 mb-4 mt-8">Epidemiological Profile</h2>
            <div className="text-body-lg leading-[1.8] text-textSecondary space-y-4">
              <p>
                {d.article?.body || 'Detailed epidemiological analysis goes here. The pathogen has shown high transmissibility in dense urban populations, primarily driven by aerosolization and prolonged surface viability. Early intervention strategies focusing on non-pharmaceutical interventions (NPIs) have yielded moderate success in curbing the R0 value.'}
              </p>
            </div>
          </div>

          {/* SIR CHART */}
          <div className="bg-bg-surface border border-bg-border rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-heading-md font-semibold flex items-center gap-2">
                <Play className="w-5 h-5 text-action-primary" /> TradingView-Style Analytics
              </h3>
            </div>
            
            <div className="h-[400px]">
              <SIRChart 
                data={results} 
                loading={false} 
                onPlayToggle={() => setIsPlaying(!isPlaying)}
              />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Stats & Map (35%) */}
        <div className="w-full lg:w-[35%] relative">
          <div className="sticky top-24 space-y-6">
            
            {/* Callout Stat Boxes */}
            <div className="bg-bg-surface border border-bg-border rounded-2xl p-6 shadow-card">
              <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider mb-4">Core Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-bg-border">
                  <span className="text-textSecondary">Total Cases</span>
                  <span className="text-xl font-bold text-action-danger">{(d.stats.totalCases).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-bg-border">
                  <span className="text-textSecondary">Active Cases</span>
                  <span className="text-xl font-bold text-action-warning">{(d.stats.activeCases).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-bg-border">
                  <span className="text-textSecondary">R₀ Value</span>
                  <span className="text-xl font-bold text-textPrimary">{d.stats.r0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-textSecondary">CFR</span>
                  <span className="text-xl font-bold text-textPrimary">{d.stats.cfr}%</span>
                </div>
              </div>
            </div>

            <div className="bg-bg-surface border border-bg-border rounded-2xl p-6 shadow-card">
              <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider mb-4">Origin & Spread</h3>
              <WorldMapPreview />
            </div>

            <div className="bg-bg-surface border border-bg-border rounded-2xl p-6 shadow-card">
              <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider mb-4">Citations</h3>
              <ul className="space-y-3">
                {d.article?.citations?.map(cite => (
                  <li key={cite.id} className="text-body-sm text-textSecondary hover:text-action-primary cursor-pointer transition-colors">
                    <span className="font-semibold text-textPrimary mr-1">[{cite.id}]</span> {cite.title}
                  </li>
                )) || <li className="text-body-sm text-textMuted">No citations.</li>}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
