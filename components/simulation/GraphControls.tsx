import { useState } from 'react';
import { Disease } from '@/types';
import { Loader2, Play } from 'lucide-react';

interface Props {
  disease: Disease;
  onRun: (params: { population: number; r0: number; days: number }) => void;
  loading: boolean;
}

export default function GraphControls({ disease, onRun, loading }: Props) {
  const [population, setPopulation] = useState(disease.population || 1000000);
  const [r0, setR0] = useState(disease.r0);
  const [days, setDays] = useState(100);

  const handleRun = () => {
    onRun({ population, r0, days });
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-full flex flex-col gap-6">
      <h4 className="text-white font-bold tracking-tight">Simulation Parameters</h4>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-textSecondary uppercase flex justify-between">
          <span>Population Base</span>
          <span className="text-white">{population.toLocaleString()}</span>
        </label>
        <input 
          type="range" min="10000" max="10000000" step="10000" 
          value={population} onChange={(e) => setPopulation(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-textSecondary uppercase flex justify-between">
          <span>Transmission (R0)</span>
          <span className="text-danger">{r0}</span>
        </label>
        <input 
          type="range" min="0.1" max="10" step="0.1" 
          value={r0} onChange={(e) => setR0(Number(e.target.value))}
          className="w-full accent-danger"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-textSecondary uppercase flex justify-between">
          <span>Time Span (Days)</span>
          <span className="text-white">{days}</span>
        </label>
        <input 
          type="range" min="30" max="365" step="1" 
          value={days} onChange={(e) => setDays(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <button 
        onClick={handleRun}
        disabled={loading}
        className="mt-auto bg-primary hover:bg-primary/90 text-background font-bold p-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
        {loading ? 'Calculating...' : 'Run Simulation'}
      </button>
    </div>
  );
}
