'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDiseaseStore } from '@/store/diseaseStore';
import { useSimulationStore } from '@/store/simulationStore';
import SIRChart from '@/components/dashboard/SIRChart';
import DiseaseStatPanel from '@/components/disease/DiseaseStatPanel';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Share2, Bookmark, Download, Play, ShieldAlert,
  ChevronRight, MapPin, Microscope, AlertCircle, RefreshCw,
} from 'lucide-react';

export default function DiseaseDetailPage() {
  const { id } = useParams() as { id: string };
  const { selectedDisease, fetchDiseaseById, isLoading, error } = useDiseaseStore();
  const { results, runSimulation, setParams, isLoading: simLoading } = useSimulationStore();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchDiseaseById(id);
  }, [id, fetchDiseaseById]);

  useEffect(() => {
    if (selectedDisease) {
      setParams({
        beta:  selectedDisease.sirParams.beta,
        gamma: selectedDisease.sirParams.gamma,
        N:     selectedDisease.sirParams.N,
        I0:    selectedDisease.sirParams.I0,
        days:  120,
      });
      runSimulation();
    }
  }, [selectedDisease, setParams, runSimulation]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto pb-20 space-y-6 animate-pulse">
        <div className="h-[380px] skeleton rounded-2xl" />
        <div className="flex gap-10">
          <div className="flex-1 space-y-4">
            <div className="h-5 w-3/4 skeleton rounded" />
            <div className="h-4 w-full skeleton rounded" />
            <div className="h-4 w-5/6 skeleton rounded" />
            <div className="h-[400px] skeleton rounded-2xl mt-8" />
          </div>
          <div className="w-[340px] space-y-4">
            <div className="h-64 skeleton rounded-2xl" />
            <div className="h-48 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error / not found
  if (error || !selectedDisease) {
    return (
      <div className="max-w-[1400px] mx-auto h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-raised rounded-2xl flex items-center justify-center mb-4 border border-border">
          <AlertCircle className="w-8 h-8 text-sir-infected" />
        </div>
        <h2 className="text-heading-xl font-bold text-textPrimary mb-2">Disease Not Found</h2>
        <p className="text-body-md text-textSecondary mb-6 max-w-sm">
          {error || 'This disease does not exist or the server is unavailable.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => fetchDiseaseById(id)}
            className="flex items-center gap-2 px-5 py-2.5 bg-action-primary/10 hover:bg-action-primary/20 text-action-primary border border-action-primary/30 rounded-lg text-body-sm font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 bg-raised hover:bg-overlay text-textSecondary border border-border rounded-lg text-body-sm font-semibold transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const d = selectedDisease;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1400px] mx-auto pb-20"
    >

      {/* ── HERO BANNER ── */}
      <div className="relative h-[380px] w-full rounded-2xl overflow-hidden mb-10 border border-border">
        {d.coverImage ? (
          <img
            src={d.coverImage}
            alt={d.name}
            className="absolute inset-0 w-full h-full object-cover scale-105 blur-sm"
          />
        ) : (
          <div className="absolute inset-0 bg-raised" />
        )}
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/85 to-black/30" />

        <div className="absolute inset-0 p-10 flex flex-col justify-end">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-textMuted mb-5">
            <Link href="/dashboard" className="hover:text-textSecondary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/dashboard" className="hover:text-textSecondary transition-colors">Diseases</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-textSecondary">{d.name}</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            {/* Left: Name + chips + author */}
            <div className="space-y-3">
              <h1 className="text-display-lg font-bold text-textPrimary leading-none">{d.name}</h1>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-base/70 backdrop-blur-sm border border-border rounded-full text-[11px] font-semibold text-textSecondary flex items-center gap-1.5 uppercase">
                  <Microscope className="w-3.5 h-3.5" /> {d.pathogenType}
                </span>
                <span className="px-3 py-1 bg-base/70 backdrop-blur-sm border border-border rounded-full text-[11px] font-semibold text-textSecondary flex items-center gap-1.5 uppercase">
                  <MapPin className="w-3.5 h-3.5" /> {d.affectedCountries?.[0]?.iso || 'Global'}
                </span>
                <span className="px-3 py-1 bg-sir-infected/20 border border-sir-infected/40 rounded-full text-[11px] font-bold text-sir-infected flex items-center gap-1.5 uppercase shadow-glow-red">
                  <ShieldAlert className="w-3.5 h-3.5" /> {d.severity}
                </span>
                <span className="px-3 py-1 bg-base/70 border border-border rounded-full text-[11px] font-semibold text-textSecondary uppercase">
                  {d.classification}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-1">
                {d.author?.avatar && (
                  <img
                    src={d.author.avatar}
                    alt={d.author.name}
                    className="w-10 h-10 rounded-full border-2 border-border object-cover"
                  />
                )}
                <div>
                  <p className="text-body-sm font-semibold text-textPrimary">{d.author?.name || 'Epidemia-Labs'}</p>
                  <p className="text-[11px] text-textSecondary">
                    {d.author?.institution || 'Research Institute'} &bull; {new Date(d.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button className="p-3 bg-base/70 backdrop-blur-sm hover:bg-raised border border-border rounded-xl text-textSecondary hover:text-textPrimary transition-colors" title="Share">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 bg-base/70 backdrop-blur-sm hover:bg-raised border border-border rounded-xl text-textSecondary hover:text-textPrimary transition-colors" title="Save">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-3 bg-base/70 backdrop-blur-sm hover:bg-raised border border-border rounded-xl text-textSecondary hover:text-textPrimary transition-colors" title="Download">
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setIsPlaying(!isPlaying); runSimulation(); }}
                className="px-5 py-3 bg-action-primary hover:bg-blue-600 rounded-xl text-white font-semibold flex items-center gap-2 transition-colors shadow-glow-blue text-body-sm"
              >
                <Play className="w-4 h-4 fill-current" /> Simulate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* LEFT: Article (65%) */}
        <div className="w-full lg:w-[65%] space-y-10">

          {/* Abstract */}
          <div className="bg-raised border-l-4 border-l-action-primary pl-5 pr-5 py-5 rounded-r-xl">
            <p className="text-body-lg italic text-textSecondary leading-relaxed">
              {d.article?.abstract || 'No abstract available for this disease.'}
            </p>
          </div>

          {/* Article body */}
          <div className="space-y-6">
            <h2 className="text-heading-md font-semibold border-l-4 border-l-action-primary pl-4">
              Epidemiological Profile
            </h2>
            <div className="text-body-lg leading-[1.85] text-textSecondary space-y-4 whitespace-pre-line">
              {d.article?.body || 'Detailed epidemiological analysis not available.'}
            </div>

            {/* Key stats callout */}
            <div className="grid grid-cols-3 gap-4 bg-surface border border-border rounded-xl p-5">
              {[
                { label: 'Case Fatality Rate', value: `${d.stats.cfr}%`, color: 'text-sir-infected' },
                { label: 'Reproduction Number R₀', value: d.stats.r0.toFixed(1), color: 'text-sir-susceptible' },
                { label: 'Total Documented Cases', value: d.stats.totalCases >= 1_000_000 ? `${(d.stats.totalCases/1_000_000).toFixed(1)}M` : `${(d.stats.totalCases/1_000).toFixed(0)}K`, color: 'text-textPrimary' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <p className={`text-2xl font-bold ${color} font-mono`}>{value}</p>
                  <p className="text-[11px] text-textMuted mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SIR Chart */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Play className="w-5 h-5 text-action-primary" />
              <h3 className="text-heading-md font-semibold">SIR Epidemic Model</h3>
              {simLoading && (
                <span className="ml-auto text-[11px] text-textMuted font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-action-primary animate-pulse" />
                  Computing...
                </span>
              )}
            </div>
            <div className="h-[400px]">
              <SIRChart
                data={results}
                loading={simLoading}
                onPlayToggle={() => setIsPlaying(!isPlaying)}
              />
            </div>
          </div>

          {/* Citations */}
          {d.article?.citations?.length > 0 && (
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="text-heading-md font-semibold mb-4">References</h3>
              <ol className="space-y-3">
                {d.article.citations.map((cite) => (
                  <li key={cite.id} className="flex gap-3 text-body-sm text-textSecondary">
                    <span className="text-textMuted font-mono flex-shrink-0">[{cite.id}]</span>
                    <span>
                      <span className="font-medium text-textPrimary">{cite.title}</span>
                      {cite.authors?.length > 0 && (
                        <span className="text-textMuted"> — {cite.authors.join(', ')}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* ── LIVE MAP — Geographic Spread ── */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-5 h-5 text-action-primary" />
              <h3 className="text-heading-md font-semibold">Geographic Spread</h3>
              <span className="relative flex items-center gap-1.5 ml-auto">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sir-infected opacity-60" />
                <span className="relative w-2 h-2 rounded-full bg-sir-infected" />
                <span className="text-[10px] font-semibold text-sir-infected uppercase tracking-wider">Live</span>
              </span>
            </div>

            {/* Map visualization using CSS grid for hotspot positions */}
            <div className="relative h-[300px] bg-raised rounded-xl border border-border overflow-hidden">
              {/* Dark world map background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-void via-base to-overlay" />

              {/* World map outline SVG - simplified */}
              <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-[0.08]" preserveAspectRatio="xMidYMid meet">
                <path d="M150,120 Q200,100 250,110 Q300,90 350,100 Q380,80 420,90 L450,85 Q480,100 500,95 L530,100 Q560,90 580,100 Q620,80 660,95 Q700,90 730,100 Q760,85 780,95 L800,100 Q830,110 850,105" stroke="#3B82F6" fill="none" strokeWidth="1.5"/>
                <path d="M200,180 Q250,170 300,175 Q350,160 400,170 Q430,180 460,175 Q500,185 540,180 Q580,170 620,175 Q660,185 700,180 Q740,170 780,175" stroke="#3B82F6" fill="none" strokeWidth="1"/>
                <path d="M250,250 Q300,240 350,245 Q400,260 450,250 Q500,240 550,248 Q600,260 650,250" stroke="#3B82F6" fill="none" strokeWidth="1"/>
                <path d="M350,320 Q400,310 450,315 Q500,330 550,320 Q580,310 610,320" stroke="#3B82F6" fill="none" strokeWidth="0.8"/>
              </svg>

              {/* Hotspot markers */}
              {(d.hotspots || []).map((hotspot, i) => {
                // Convert lat/lng to approximate position percentages
                const x = ((hotspot.lng + 180) / 360) * 100;
                const y = ((90 - hotspot.lat) / 180) * 100;
                return (
                  <div
                    key={i}
                    className="absolute group"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    {/* Pulse animation */}
                    <span
                      className="absolute w-6 h-6 rounded-full bg-sir-infected/30 animate-ping"
                      style={{ animationDelay: `${i * 0.3}s`, animationDuration: '2s' }}
                    />
                    {/* Core dot */}
                    <span
                      className="relative block w-3 h-3 rounded-full bg-sir-infected border border-sir-infected/60 shadow-glow-red"
                      style={{ opacity: 0.5 + hotspot.intensity * 0.5 }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-overlay border border-border rounded-lg text-[10px] font-mono text-textPrimary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                      {hotspot.label} — {(hotspot.intensity * 100).toFixed(0)}% intensity
                    </div>
                  </div>
                );
              })}

              {/* Empty state if no hotspots */}
              {(!d.hotspots || d.hotspots.length === 0) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-body-sm text-textMuted">No geographic data available</p>
                </div>
              )}
            </div>

            {/* Affected countries legend */}
            {d.affectedCountries && d.affectedCountries.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {d.affectedCountries.map((country) => (
                  <span
                    key={country.iso}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-raised border border-border rounded-lg text-[11px] font-mono"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      country.severity === 'critical' ? 'bg-sir-infected' :
                      country.severity === 'high' ? 'bg-sir-susceptible' : 'bg-action-primary'
                    }`} />
                    <span className="text-textSecondary">{country.iso}</span>
                    <span className="text-textMuted">
                      {country.cases >= 1_000_000 ? `${(country.cases / 1_000_000).toFixed(1)}M` : `${(country.cases / 1_000).toFixed(0)}K`}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Sticky stat panel (35%) */}
        <div className="w-full lg:w-[35%]">
          <div className="lg:sticky lg:top-[88px]">
            <DiseaseStatPanel disease={d} />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
