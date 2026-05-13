import { Disease } from '@/types';
import { ShieldAlert, Activity, Wind, Users } from 'lucide-react';

export default function HeroSection({ disease }: { disease: Disease }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-lg relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-danger/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{disease.name}</h1>
          <p className="text-textSecondary max-w-2xl text-lg leading-relaxed">{disease.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 relative z-10">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-textSecondary text-xs font-bold uppercase mb-1 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> R-Naught (R0)</div>
          <div className="text-2xl font-mono text-danger">{disease.r0}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-textSecondary text-xs font-bold uppercase mb-1 flex items-center gap-2"><Activity className="w-4 h-4"/> Mortality</div>
          <div className="text-2xl font-mono text-white">{disease.mortality_rate}%</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-textSecondary text-xs font-bold uppercase mb-1 flex items-center gap-2"><Wind className="w-4 h-4"/> Vector</div>
          <div className="text-xl font-medium text-white capitalize">{disease.transmission}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="text-textSecondary text-xs font-bold uppercase mb-1 flex items-center gap-2"><Users className="w-4 h-4"/> Affected</div>
          <div className="text-xl font-mono text-white">{(disease.population || 0).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
