'use client';

import { Map, Globe, AlertTriangle, Activity, Info } from 'lucide-react';

const HOTSPOTS = [
  { region: 'Southeast Asia', cases: '2.4M', trend: '+12%', risk: 'high' },
  { region: 'West Africa', cases: '890K', trend: '+8%', risk: 'high' },
  { region: 'South America', cases: '1.1M', trend: '+3%', risk: 'medium' },
  { region: 'Eastern Europe', cases: '340K', trend: '-2%', risk: 'low' },
  { region: 'Middle East', cases: '560K', trend: '+5%', risk: 'medium' },
  { region: 'Central Asia', cases: '210K', trend: '+1%', risk: 'low' },
];

function RiskBadge({ risk }: { risk: string }) {
  const styles: Record<string, string> = {
    high:   'bg-danger/15 text-danger border-danger/25',
    medium: 'bg-warning/15 text-warning border-warning/25',
    low:    'bg-success/15 text-success border-success/25',
  };
  return (
    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border ${styles[risk]}`}>
      {risk}
    </span>
  );
}

export default function MapPage() {
  return (
    <div className="p-6 h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <Map className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Global Heatmap</h2>
          </div>
          <p className="text-textSecondary text-sm mt-0.5">
            Real-time disease outbreak distribution across regions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Live Feed
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Map placeholder */}
        <div className="flex-1 bg-surface border border-border rounded-2xl overflow-hidden relative flex items-center justify-center">
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-grid opacity-20" />

          {/* Glow orbs simulating hotspots */}
          <div className="absolute top-[25%] left-[65%] w-20 h-20 bg-danger/30 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute top-[40%] left-[20%] w-14 h-14 bg-danger/25 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-[55%] left-[45%] w-16 h-16 bg-warning/20 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[30%] left-[35%] w-10 h-10 bg-warning/20 rounded-full blur-lg animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[60%] left-[72%] w-8 h-8 bg-success/20 rounded-full blur-lg animate-pulse-slow" style={{ animationDelay: '0.8s' }} />

          {/* SVG globe placeholder */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-textMuted">
            <Globe className="w-24 h-24 opacity-10 text-primary animate-float" />
            <div className="text-center">
              <p className="text-sm font-semibold text-white">Interactive Map</p>
              <p className="text-xs mt-1 max-w-xs text-center">
                Interactive disease heatmap is loading. Connect a mapping library
                (Mapbox / Leaflet) to render real outbreak data.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
              <Info className="w-3.5 h-3.5" />
              Integration ready — awaiting map tile provider API key
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2.5">
            {[
              { label: 'High Risk', color: 'bg-danger' },
              { label: 'Medium', color: 'bg-warning' },
              { label: 'Contained', color: 'bg-success' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-textSecondary">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Hotspot sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-3">
          <div className="bg-surface border border-border rounded-2xl p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-semibold text-white">Active Hotspots</h3>
            </div>
            <div className="space-y-2 overflow-y-auto">
              {HOTSPOTS.map((h) => (
                <div key={h.region}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50 hover:border-border transition-all cursor-pointer">
                  <div>
                    <p className="text-xs font-medium text-white">{h.region}</p>
                    <p className="text-[11px] text-textMuted font-mono mt-0.5">{h.cases} cases</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <RiskBadge risk={h.risk} />
                    <span className={`text-[10px] font-mono ${h.trend.startsWith('+') ? 'text-danger' : 'text-success'}`}>
                      {h.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-white">Global Summary</h3>
            </div>
            {[
              { label: 'Active Regions', value: '47' },
              { label: 'Total Cases', value: '5.5M' },
              { label: 'Avg R₀', value: '2.3' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-border/40 last:border-0">
                <span className="text-xs text-textSecondary">{label}</span>
                <span className="text-xs font-bold text-white font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
