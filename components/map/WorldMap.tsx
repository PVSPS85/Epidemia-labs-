import { Globe, Crosshair } from 'lucide-react';

export default function WorldMap() {
  return (
    <div className="w-full h-[400px] bg-[#0A0A0B] border border-border rounded-xl relative overflow-hidden flex flex-col items-center justify-center shadow-lg shadow-black/50 group">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Scanning Radar Line */}
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.8)] hidden group-hover:block animate-pulse"></div>
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.8)] hidden group-hover:block animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center text-center p-6 bg-surface/50 backdrop-blur-sm border border-border/50 rounded-2xl">
        <Globe className="w-12 h-12 text-primary mb-3 animate-[spin_10s_linear_infinite]" />
        <h3 className="text-white font-bold tracking-[0.2em] uppercase text-sm flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-danger" />
          Global Surveillance Link
        </h3>
        <p className="text-textSecondary text-xs mt-2 uppercase">Awaiting Geospatial API Authorization...</p>
      </div>
    </div>
  );
}
