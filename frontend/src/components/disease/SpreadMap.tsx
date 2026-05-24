'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';

import { Play, Square } from 'lucide-react';

interface Hotspot {
  lat: number;
  lng: number;
  label: string;
  intensity: number;
}

interface SpreadMapProps {
  hotspots: Hotspot[];
  simYears: number;
  maxYears: number;
}

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function SpreadMap({ hotspots, simYears, maxYears }: SpreadMapProps) {
  const [visibleCount, setVisibleCount] = useState(1);
  const [isPlayingMap, setIsPlayingMap] = useState(false);

  useEffect(() => {
    if (isPlayingMap) {
      if (!hotspots || hotspots.length <= 1) return;
      setVisibleCount(1);
      const timers: NodeJS.Timeout[] = [];
      for (let i = 1; i < hotspots.length; i++) {
        const timer = setTimeout(() => {
          setVisibleCount(prev => prev + 1);
        }, i * 800); // 0.8s per step for a faster global spread
        timers.push(timer);
      }
      
      const finishTimer = setTimeout(() => {
        setIsPlayingMap(false);
      }, hotspots.length * 800 + 1000);
      timers.push(finishTimer);

      return () => timers.forEach(clearTimeout);
    } else {
      if (!hotspots || hotspots.length === 0) return;
      const percentage = Math.min(simYears / maxYears, 1);
      const targetCount = Math.max(1, Math.ceil(percentage * hotspots.length));
      setVisibleCount(targetCount);
    }
  }, [isPlayingMap, hotspots, simYears, maxYears]);

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
    <div className="w-full h-full relative bg-[#0B1120] overflow-hidden rounded-xl">
      <ComposableMap 
        projection="geoMercator" 
        projectionConfig={{ scale: 140, center: [0, 20] }}
        width={800}
        height={450}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1E293B"
                stroke="#334155"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#334155', outline: 'none' },
                  pressed: { outline: 'none' }
                }}
              />
            ))
          }
        </Geographies>

        {/* Transmission Lines */}
        {visibleHotspots.slice(1).map((h, i) => (
          <Line
            key={`line-${i}`}
            from={[origin.lng, origin.lat]}
            to={[h.lng, h.lat]}
            stroke="#EF4444"
            strokeWidth={1.5}
            className="animate-draw-line"
            style={{ opacity: 0.6 }}
          />
        ))}

        {/* Hotspot Markers */}
        {visibleHotspots.map((h, i) => {
          const isOrigin = i === 0;
          return (
            <Marker key={`marker-${i}`} coordinates={[h.lng, h.lat]}>
              <circle 
                r={isOrigin ? 6 : 4} 
                fill="#EF4444" 
                stroke="#fff" 
                strokeWidth={isOrigin ? 2 : 1}
                className={isOrigin ? "animate-pulse" : ""}
                opacity={0.9} 
              />
              <text
                textAnchor="middle"
                y={isOrigin ? -12 : -8}
                style={{
                  fontFamily: 'monospace',
                  fontSize: isOrigin ? '12px' : '10px',
                  fontWeight: 'bold',
                  fill: '#F8FAFC',
                  textShadow: '0px 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                {h.label}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Play Controls & Legend Overlay */}
      <div className="absolute top-4 right-4 z-20 flex gap-3">
        <button
          onClick={() => setIsPlayingMap(!isPlayingMap)}
          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-action-primary/20 text-action-primary hover:bg-action-primary/30 border border-action-primary/30 backdrop-blur-md font-semibold text-sm transition-all"
        >
          {isPlayingMap ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          {isPlayingMap ? 'Stop' : 'Play Spread'}
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-20 bg-void/80 backdrop-blur-md border border-border p-3 rounded-lg text-[10px] font-mono text-textSecondary">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-sir-infected animate-pulse" /> 
          Origin Point
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full border border-sir-infected" /> 
          Transmission Vector
        </div>
      </div>
    </div>
  );
}
