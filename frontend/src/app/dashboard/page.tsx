'use client';

import { useEffect, useState } from 'react';
import { useDiseaseStore } from '@/store/diseaseStore';
import StatChip from '@/components/dashboard/StatChip';
import DiseaseCard from '@/components/disease/DiseaseCard';
import WorldMapPreview from '@/components/disease/WorldMapPreview';
import { Activity, Users, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { diseases, fetchDiseases, isLoading } = useDiseaseStore();
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const stats = {
    activeCases: diseases.reduce((acc, d) => acc + d.stats.activeCases, 0) || 0,
    atRisk: diseases.length > 0 ? diseases.length * 15000 : 0, 
    recovered: diseases.reduce((acc, d) => acc + d.stats.recovered, 0) || 0,
    publications: 0
  };

  const tabs = ['All', 'Pandemic', 'Epidemic', 'Endemic', 'Contained'];
  
  const filteredDiseases = activeTab === 'All' 
    ? diseases 
    : diseases.filter(d => 
        activeTab === 'Contained' 
          ? d.status === 'contained' 
          : d.classification === activeTab.toLowerCase()
      );

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      
      {/* HERO STAT STRIP */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatChip label="Active Cases" value={stats.activeCases} variant="red" sub="+12% this week" icon={<AlertTriangle className="w-5 h-5" />} loading={isLoading} />
          <StatChip label="At Risk Pop." value={stats.atRisk} variant="yellow" sub="Global estimate" icon={<Users className="w-5 h-5" />} loading={isLoading} />
          <StatChip label="Recovered" value={stats.recovered} variant="green" sub="+5.2% this week" icon={<ShieldCheck className="w-5 h-5" />} loading={isLoading} />
          <StatChip label="Publications" value={stats.publications} variant="blue" sub="3 new today" icon={<FileText className="w-5 h-5" />} loading={isLoading} />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: ACTIVE OUTBREAK FEED */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-xl font-bold flex items-center gap-3">
              Active Outbreak Feed
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-action-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-action-danger"></span>
              </span>
            </h2>
          </div>

          <div className="flex gap-2 border-b border-bg-border pb-px">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-action-primary text-action-primary' : 'border-transparent text-textSecondary hover:text-textPrimary'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="w-full h-[400px] bg-surface-2 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDiseases.length > 0 ? (
                filteredDiseases.map(disease => (
                  <DiseaseCard key={disease.id} disease={disease} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-textMuted border border-dashed border-bg-border rounded-xl">
                  No diseases found for this filter.
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: MAP & TRENDING */}
        <div className="space-y-10">
          
          <section>
            <h2 className="text-heading-lg font-bold mb-4">Global Alert Map</h2>
            <WorldMapPreview />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-lg font-bold">Trending Research</h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-textSecondary hover:text-textPrimary transition-colors">&larr;</button>
                <button className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-textSecondary hover:text-textPrimary transition-colors">&rarr;</button>
              </div>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-bg-surface border border-bg-border p-4 rounded-xl hover:border-action-primary/50 transition-colors cursor-pointer group">
                  <div className="text-[10px] text-action-primary font-mono uppercase mb-1">Epidemiology • 2h ago</div>
                  <h4 className="text-sm font-semibold text-textPrimary group-hover:text-action-primary transition-colors leading-snug mb-2">
                    Comparative Analysis of R₀ in Urban vs Rural environments
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-textSecondary">
                    <img src={`https://i.pravatar.cc/100?img=${i+5}`} alt="" className="w-4 h-4 rounded-full" />
                    Dr. Alan Turing
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
