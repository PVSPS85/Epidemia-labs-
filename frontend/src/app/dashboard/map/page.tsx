'use client';

import { useState, memo, useEffect } from 'react';
import { useDiseaseStore } from '@/store/diseaseStore';
import {
  MapPin, AlertTriangle, Activity, Navigation, ZoomIn, ZoomOut, Globe,
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const RISK_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  critical: { bg: 'bg-sir-infected/10',    text: 'text-sir-infected',    border: 'border-sir-infected/20',    dot: 'bg-sir-infected' },
  high:     { bg: 'bg-action-warning/10',  text: 'text-action-warning',  border: 'border-action-warning/20',  dot: 'bg-action-warning' },
  moderate: { bg: 'bg-sir-recovered/10',   text: 'text-sir-recovered',   border: 'border-sir-recovered/20',   dot: 'bg-sir-recovered' },
  low:      { bg: 'bg-sir-recovered/10',   text: 'text-sir-recovered',   border: 'border-sir-recovered/20',   dot: 'bg-sir-recovered' },
};

// Map hotspot color from severity
function getSeverityColor(severity: string) {
  const map: Record<string, string> = {
    critical: '#EF4444',
    high:     '#F59E0B',
    moderate: '#10B981',
    low:      '#10B981',
  };
  return map[severity] ?? '#3B82F6';
}

const MapChart = memo(({ hotspots, onRegionClick }: {
  hotspots: { lat: number; lng: number; label: string; intensity: number; severity?: string }[];
  onRegionClick: (label: string) => void;
}) => {
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });

  return (
    <div className="relative w-full h-full">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => setPosition(p => ({ ...p, zoom: Math.min(p.zoom * 1.5, 6) }))}
          className="w-8 h-8 bg-surface border border-border rounded-lg flex items-center justify-center hover:bg-raised transition-colors"
        >
          <ZoomIn className="w-4 h-4 text-textSecondary" />
        </button>
        <button
          onClick={() => setPosition(p => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) }))}
          className="w-8 h-8 bg-surface border border-border rounded-lg flex items-center justify-center hover:bg-raised transition-colors"
        >
          <ZoomOut className="w-4 h-4 text-textSecondary" />
        </button>
      </div>

      <ComposableMap
        projectionConfig={{ scale: 140 }}
        width={800}
        height={400}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={(pos) => setPosition(pos)}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--bg-raised)"
                  stroke="var(--bg-border)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover:   { fill: 'var(--bg-overlay)', outline: 'none', cursor: 'pointer' },
                    pressed: { fill: 'var(--bg-border)',  outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {hotspots.map((h) => {
            const color = getSeverityColor(h.severity ?? 'moderate');
            const r = 4 + h.intensity * 10;
            return (
              <Marker key={h.label} coordinates={[h.lng, h.lat] as [number, number]} onClick={() => onRegionClick(h.label)}>
                <circle r={r} fill={color} opacity={0.18} />
                <circle r={r * 0.45} fill={color} opacity={0.85} />
                <text
                  textAnchor="middle"
                  y={-r - 4}
                  style={{ fontFamily: 'var(--font-poppins)', fontSize: '7px', fill: 'var(--text-muted)' }}
                  className="pointer-events-none select-none"
                >
                  {h.label}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
});
MapChart.displayName = 'MapChart';

export default function MapPage() {
  const { diseases, fetchDiseases, isLoading } = useDiseaseStore();
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  // Flatten all hotspots from all diseases + annotate severity
  const hotspots = diseases.flatMap(d =>
    (d.hotspots ?? []).map(h => ({
      ...h,
      severity: d.severity,
      disease:  d.name,
    }))
  );

  // Aggregate stats from real data
  const activeCases = diseases.reduce((a, d) => a + (d.stats?.activeCases ?? 0), 0);
  const avgR0 = diseases.length > 0
    ? (diseases.reduce((a, d) => a + (d.stats?.r0 ?? 0), 0) / diseases.length).toFixed(1)
    : '—';

  return (
    <div className="max-w-[1400px] mx-auto pb-16 h-[calc(100vh-96px)] flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-action-primary/10 border border-action-primary/20 flex items-center justify-center text-action-primary">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-heading-xl font-bold text-textPrimary">Global Live Map</h2>
            <p className="text-body-sm text-textSecondary">
              Real-time disease outbreak distribution across {diseases.length} tracked pathogens
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-sir-recovered/20 bg-sir-recovered/10 text-sir-recovered text-body-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-sir-recovered animate-pulse" />
          Live Feed
        </div>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">

        {/* Map */}
        <div className="flex-1 bg-base border border-border rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none z-0" />
          {isLoading ? (
            <div className="w-full h-full skeleton" />
          ) : (
            <MapChart hotspots={hotspots} onRegionClick={setSelectedHotspot} />
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-surface/90 backdrop-blur-md border border-border rounded-lg px-4 py-2.5 z-10">
            {[
              { label: 'Critical',  color: 'bg-sir-infected' },
              { label: 'High',      color: 'bg-action-warning' },
              { label: 'Contained', color: 'bg-sir-recovered' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-body-sm text-textSecondary">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>

          {/* Selected region tooltip */}
          {selectedHotspot && (
            <div className="absolute top-4 left-4 bg-surface/95 backdrop-blur-md border border-border rounded-xl px-4 py-3 z-10 shadow-card animate-fade-in">
              <p className="text-[10px] text-textMuted mb-1 flex items-center gap-1 uppercase tracking-wider">
                <Navigation className="w-3 h-3" /> Selected
              </p>
              <p className="text-body-sm font-bold text-textPrimary">{selectedHotspot}</p>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-[11px] text-textMuted hover:text-sir-infected mt-1 transition-colors"
              >
                dismiss ×
              </button>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-[260px] flex-shrink-0 flex flex-col gap-4">

          {/* Active Hotspots */}
          <div className="bg-surface border border-border rounded-2xl p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-action-warning" />
              <h3 className="text-body-sm font-semibold text-textPrimary">Active Hotspots</h3>
              <span className="ml-auto text-[11px] text-textMuted">{hotspots.length}</span>
            </div>
            <div className="space-y-2 overflow-y-auto flex-1 scrollbar-hide pr-1">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 skeleton rounded-lg" />
                ))
              ) : hotspots.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <MapPin className="w-6 h-6 text-textMuted mb-2 opacity-40" />
                  <p className="text-body-sm text-textMuted">No hotspot data yet</p>
                </div>
              ) : (
                hotspots.slice(0, 12).map((h, i) => {
                  const cfg = RISK_STYLES[h.severity ?? 'low'] ?? RISK_STYLES.low;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedHotspot(h.label)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                        selectedHotspot === h.label
                          ? `${cfg.bg} ${cfg.border}`
                          : 'bg-base border-border hover:bg-raised'
                      }`}
                    >
                      <div>
                        <p className="text-body-sm font-medium text-textPrimary leading-snug">{h.label}</p>
                        <p className="text-[11px] text-textMuted">{h.disease}</p>
                      </div>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {h.severity}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Global Summary */}
          <div className="bg-surface border border-border rounded-2xl p-4 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-action-primary" />
              <h3 className="text-body-sm font-semibold text-textPrimary">Global Summary</h3>
            </div>
            {[
              { label: 'Tracked Pathogens', value: isLoading ? '—' : String(diseases.length) },
              { label: 'Total Active Cases', value: isLoading ? '—' : activeCases >= 1e6 ? `${(activeCases/1e6).toFixed(1)}M` : activeCases.toLocaleString() },
              { label: 'Avg R₀',            value: isLoading ? '—' : avgR0 },
              { label: 'Mapped Hotspots',   value: isLoading ? '—' : String(hotspots.length) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-body-sm text-textSecondary">{label}</span>
                <span className="text-body-sm font-bold text-textPrimary font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
