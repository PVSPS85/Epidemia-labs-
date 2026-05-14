'use client';

import { useState, memo } from 'react';
import { Map, AlertTriangle, Activity, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const HOTSPOTS = [
  { region: 'Southeast Asia', coordinates: [103.8, 1.3] as [number, number], cases: '2.4M', trend: '+12%', risk: 'high' },
  { region: 'West Africa', coordinates: [-10.0, 8.0] as [number, number], cases: '890K', trend: '+8%', risk: 'high' },
  { region: 'South America', coordinates: [-60.0, -10.0] as [number, number], cases: '1.1M', trend: '+3%', risk: 'medium' },
  { region: 'Eastern Europe', coordinates: [30.0, 50.0] as [number, number], cases: '340K', trend: '-2%', risk: 'low' },
  { region: 'Middle East', coordinates: [45.0, 25.0] as [number, number], cases: '560K', trend: '+5%', risk: 'medium' },
  { region: 'Central Asia', coordinates: [65.0, 40.0] as [number, number], cases: '210K', trend: '+1%', risk: 'low' },
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

const MapChart = memo(({ onRegionClick }: { onRegionClick: (region: string) => void }) => {
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleMoveEnd = (position: { coordinates: [number, number], zoom: number }) => {
    setPosition(position);
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button onClick={handleZoomIn} className="w-8 h-8 bg-surface border border-border rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors">
          <ZoomIn className="w-4 h-4 text-textSecondary" />
        </button>
        <button onClick={handleZoomOut} className="w-8 h-8 bg-surface border border-border rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors">
          <ZoomOut className="w-4 h-4 text-textSecondary" />
        </button>
      </div>
      
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        width={800}
        height={400}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1A1F2C"
                  stroke="#2D3342"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#242A38", outline: "none", cursor: "pointer" },
                    pressed: { fill: "#2D3342", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Render Hotspots */}
          {HOTSPOTS.map((hotspot) => {
            const isHigh = hotspot.risk === 'high';
            const color = isHigh ? "#EF4444" : hotspot.risk === 'medium' ? "#F59E0B" : "#10B981";
            
            return (
              <Marker key={hotspot.region} coordinates={hotspot.coordinates} onClick={() => onRegionClick(hotspot.region)}>
                {/* Pulsating background circle */}
                <circle r={isHigh ? 12 : 8} fill={color} opacity={0.2} className="animate-ping" />
                {/* Static center dot */}
                <circle r={isHigh ? 4 : 3} fill={color} />
                {/* Text Label hidden until zoomed or hovered via css class */}
                <text
                  textAnchor="middle"
                  y={-12}
                  style={{ fontFamily: "monospace", fontSize: "8px", fill: "#94A3B8" }}
                  className="pointer-events-none"
                >
                  {hotspot.region}
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
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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
          Live Feed Active
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Interactive Map Area */}
        <div className="flex-1 bg-background border border-border rounded-2xl overflow-hidden relative flex flex-col">
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          
          <MapChart onRegionClick={setSelectedRegion} />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-surface/90 backdrop-blur-md border border-border rounded-lg px-4 py-2.5 z-10 shadow-xl">
            {[
              { label: 'Critical / High', color: 'bg-danger' },
              { label: 'Elevated', color: 'bg-warning' },
              { label: 'Contained', color: 'bg-success' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-textSecondary font-medium">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
          
          {selectedRegion && (
             <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md border border-border rounded-lg px-4 py-3 z-10 shadow-glow-cyan animate-fade-in">
               <p className="text-xs text-textMuted mb-1 flex items-center gap-1">
                 <Navigation className="w-3 h-3" /> Selected Region
               </p>
               <p className="text-sm font-bold text-white">{selectedRegion}</p>
             </div>
          )}
        </div>

        {/* Hotspot sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-3">
          <div className="bg-surface border border-border rounded-2xl p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-semibold text-white">Active Hotspots</h3>
            </div>
            <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
              {HOTSPOTS.map((h) => (
                <div key={h.region}
                  onClick={() => setSelectedRegion(h.region)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedRegion === h.region 
                      ? 'bg-primary/10 border-primary/50 shadow-glow-cyan' 
                      : 'bg-background border-border/50 hover:border-border'
                  }`}>
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
