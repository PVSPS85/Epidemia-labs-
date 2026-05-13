'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Disease } from '@/types';
import HeroSection from '@/components/disease/HeroSection';
import SIRGraph from '@/components/simulation/SIRGraph';
import GraphControls from '@/components/simulation/GraphControls';
import { useSimulation } from '@/hooks/useSimulation';
import { Loader2 } from 'lucide-react';

export default function DiseasePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [disease, setDisease] = useState<Disease | null>(null);
  const { data: simData, loading: simLoading, runSimulation } = useSimulation();

  // Load the disease data from your backend
  useEffect(() => {
    const fetchDisease = async () => {
      try {
        const res = await api.getDiseaseById(id);
        setDisease(res.data);
        
        // Auto-run the first simulation with default numbers
        if (res.data) {
          runSimulation({
            population: res.data.population || 1000000,
            r0: res.data.r0,
            days: 100
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (id) fetchDisease();
  }, [id]);

  if (!disease) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Top Half: The Disease Info */}
        <HeroSection disease={disease} />

        {/* Bottom Half: The Interactive Math Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-surface border border-border rounded-xl p-6 shadow-xl shadow-black">
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Epidemiological Curve (SIR Model)</h3>
            <SIRGraph data={simData} loading={simLoading} />
          </div>
          
          <div className="lg:col-span-1">
            <GraphControls 
              disease={disease} 
              onRun={(params) => runSimulation(params)} 
              loading={simLoading} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
