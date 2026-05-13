import { Disease } from '@/types';
import { AlertTriangle } from 'lucide-react';

export default function TrendingPanel({ diseases }: { diseases: Disease[] }) {
  // Sort diseases to find the most infectious (highest R0)
  const highThreats = [...diseases].sort((a, b) => b.r0 - a.r0).slice(0, 3);

  return (
    <div className="bg-surface border border-border rounded-xl p-5 sticky top-24 shadow-xl shadow-black/40">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-danger" />
        High Threat Monitoring
      </h3>
      
      <div className="flex flex-col gap-4">
        {highThreats.map((disease) => (
          <div key={disease.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-white text-sm">{disease.name}</span>
              <span className="text-xs bg-danger/20 text-danger px-2 py-0.5 rounded font-mono">
                R0: {disease.r0}
              </span>
            </div>
            <p className="text-xs text-textSecondary capitalize">{disease.transmission} Transmission</p>
          </div>
        ))}
      </div>
    </div>
  );
}
