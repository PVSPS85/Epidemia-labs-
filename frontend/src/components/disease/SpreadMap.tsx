'use client';

import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';
import { useState, useEffect } from 'react';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';

interface Hotspot {
  lat: number;
  lng: number;
  label: string;
  intensity: number;
}

interface SpreadMapProps {
  hotspots: Hotspot[];
}

export default function SpreadMap({ hotspots }: SpreadMapProps) {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (!hotspots || hotspots.length <= 1) return;
    setVisibleCount(1);
    const timers: NodeJS.Timeout[] = [];
    for (let i = 1; i < hotspots.length; i++) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, i * 1200);
      timers.push(timer);
    }
    return () => timers.forEach(clearTimeout);
  }, [hotspots]);

  if (!hotspots || hotspots.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-textMuted font-mono text-sm">
        No geographic data available
      </div>
    );
  }

  const origin = hotspots[0];
  const visibleHotspots = hotspots.slice(0, visibleCount);

  return (
    <div className="w-full h-full relative">
      <ComposableMap
        projectionConfig={{ scale: 150, center: [20, 10] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1E293B"
                stroke="#334155"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', fill: '#334155' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* Trajectory lines from origin to visible destinations */}
        {visibleHotspots.slice(1).map((h, i) => (
          <Line
            key={`line-${i}`}
            from={[origin.lng, origin.lat]}
            to={[h.lng, h.lat]}
            stroke="#EF4444"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray="6 4"
            strokeOpacity={0.6}
          />
        ))}

        {/* Hotspot markers */}
        {visibleHotspots.map((h, i) => {
          const isOrigin = i === 0;
          const r = isOrigin ? 8 : 4 + h.intensity * 4;
          return (
            <Marker key={`marker-${i}`} coordinates={[h.lng, h.lat]}>
              {/* Pulse ring */}
              <circle r={r * 2.5} fill="none" stroke="#EF4444" strokeWidth={0.8} opacity={0.3}>
                <animate attributeName="r" from={String(r)} to={String(r * 3)} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Main dot */}
              <circle r={r} fill="#EF4444" opacity={0.6 + h.intensity * 0.4} />
              {/* Label */}
              <text
                textAnchor="middle"
                y={-r - 6}
                style={{
                  fontFamily: 'monospace',
                  fontSize: isOrigin ? 11 : 9,
                  fontWeight: 'bold',
                  fill: '#F8FAFC',
                }}
              >
                {isOrigin ? `⚡ ${h.label}` : h.label}
              </text>
              {/* Intensity */}
              <text
                textAnchor="middle"
                y={r + 14}
                style={{
                  fontFamily: 'monospace',
                  fontSize: 8,
                  fill: '#EF4444',
                }}
              >
                {(h.intensity * 100).toFixed(0)}%
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
