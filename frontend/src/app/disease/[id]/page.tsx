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
              <h3 className="text-heading-md font-semibold">Geographic Spread Simulation</h3>
              <span className="relative flex items-center gap-1.5 ml-auto">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sir-infected opacity-60" />
                <span className="relative w-2 h-2 rounded-full bg-sir-infected" />
                <span className="text-[10px] font-semibold text-sir-infected uppercase tracking-wider">Live</span>
              </span>
            </div>

            {/* Animated SVG Map */}
            <div className="relative h-[400px] bg-raised rounded-xl border border-border overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-void via-base to-overlay" />

              <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* World map continent outlines */}
                {/* North America */}
                <path d="M120,80 L180,60 L220,70 L260,90 L280,120 L270,160 L240,200 L200,230 L160,240 L140,220 L120,180 L100,140 Z" fill="none" stroke="#3B82F6" strokeWidth="0.8" opacity="0.2" />
                {/* South America */}
                <path d="M220,260 L260,240 L290,260 L300,300 L290,340 L270,380 L240,400 L220,380 L210,340 L200,300 Z" fill="none" stroke="#3B82F6" strokeWidth="0.8" opacity="0.2" />
                {/* Europe */}
                <path d="M440,60 L480,50 L520,60 L540,80 L530,110 L500,120 L470,110 L450,90 Z" fill="none" stroke="#3B82F6" strokeWidth="0.8" opacity="0.2" />
                {/* Africa */}
                <path d="M460,140 L500,130 L540,140 L560,180 L570,240 L560,300 L530,340 L490,360 L460,340 L440,300 L430,240 L440,180 Z" fill="none" stroke="#3B82F6" strokeWidth="0.8" opacity="0.2" />
                {/* Asia */}
                <path d="M560,50 L620,40 L700,50 L780,70 L820,100 L830,140 L800,180 L750,200 L700,190 L650,180 L600,150 L570,120 L560,80 Z" fill="none" stroke="#3B82F6" strokeWidth="0.8" opacity="0.2" />
                {/* India */}
                <path d="M660,160 L690,150 L710,180 L700,230 L680,260 L660,240 L650,200 Z" fill="none" stroke="#3B82F6" strokeWidth="0.8" opacity="0.2" />
                {/* Australia */}
                <path d="M780,300 L840,290 L880,310 L870,350 L830,370 L790,360 L770,330 Z" fill="none" stroke="#3B82F6" strokeWidth="0.8" opacity="0.2" />

                {/* Grid lines */}
                {[100,200,300,400].map(y => (
                  <line key={`h-${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="#3B82F6" strokeWidth="0.3" opacity="0.08" />
                ))}
                {[200,400,600,800].map(x => (
                  <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#3B82F6" strokeWidth="0.3" opacity="0.08" />
                ))}

                {/* Animated trajectory lines from origin to other hotspots */}
                {d.hotspots && d.hotspots.length > 1 && d.hotspots.slice(1).map((hotspot, i) => {
                  const origin = d.hotspots[0];
                  const ox = ((origin.lng + 180) / 360) * 1000;
                  const oy = ((90 - origin.lat) / 180) * 500;
                  const tx = ((hotspot.lng + 180) / 360) * 1000;
                  const ty = ((90 - hotspot.lat) / 180) * 500;
                  const cx = (ox + tx) / 2;
                  const cy = Math.min(oy, ty) - 60;
                  const pathD = `M ${ox} ${oy} Q ${cx} ${cy} ${tx} ${ty}`;

                  return (
                    <g key={`traj-${i}`}>
                      {/* Glow trail */}
                      <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity={0.15}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.5, delay: i * 1.2 + 0.5, ease: "easeInOut" }}
                      />
                      {/* Main line */}
                      <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeDasharray="6 4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{ duration: 2.5, delay: i * 1.2 + 0.5, ease: "easeInOut" }}
                      />
                    </g>
                  );
                })}

                {/* Hotspot markers as SVG circles */}
                {(d.hotspots || []).map((hotspot, i) => {
                  const cx = ((hotspot.lng + 180) / 360) * 1000;
                  const cy = ((90 - hotspot.lat) / 180) * 500;
                  const isOrigin = i === 0;
                  const r = isOrigin ? 8 : 5 + hotspot.intensity * 3;

                  return (
                    <g key={`dot-${i}`}>
                      {/* Outer pulse ring */}
                      <motion.circle
                        cx={cx} cy={cy} r={r * 3}
                        fill="none" stroke="#EF4444" strokeWidth="1"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5, 2] }}
                        transition={{
                          duration: 2,
                          delay: isOrigin ? 0.2 : i * 1.2 + 2.5,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                      {/* Core dot */}
                      <motion.circle
                        cx={cx} cy={cy} r={r}
                        fill="#EF4444"
                        opacity={0.6 + hotspot.intensity * 0.4}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.6 + hotspot.intensity * 0.4 }}
                        transition={{
                          duration: 0.6,
                          delay: isOrigin ? 0 : i * 1.2 + 2.5,
                          type: 'spring',
                        }}
                      />
                      {/* Label */}
                      <motion.text
                        x={cx} y={cy - r - 6}
                        textAnchor="middle"
                        fill="#F8FAFC"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: isOrigin ? 0.3 : i * 1.2 + 3 }}
                      >
                        {hotspot.label}
                      </motion.text>
                      {/* Intensity label */}
                      <motion.text
                        x={cx} y={cy + r + 14}
                        textAnchor="middle"
                        fill="#EF4444"
                        fontSize="9"
                        fontFamily="monospace"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ delay: isOrigin ? 0.5 : i * 1.2 + 3.2 }}
                      >
                        {(hotspot.intensity * 100).toFixed(0)}%
                      </motion.text>
                    </g>
                  );
                })}

                {/* Empty state */}
                {(!d.hotspots || d.hotspots.length === 0) && (
                  <text x="500" y="250" textAnchor="middle" fill="#64748B" fontSize="14" fontFamily="monospace">
                    No geographic data available
                  </text>
                )}
              </svg>
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
