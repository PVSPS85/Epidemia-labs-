import { useState } from 'react';
import { api } from '@/lib/api';
import { SimulationResult } from '@/types';

export function useSimulation() {
  const [data, setData] = useState<SimulationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async (params: { population: number; r0: number; days: number }) => {
    setLoading(true);
    setError(null);
    try {
      // Calls your POST /simulate/run Python endpoint!
      const response = await api.runSimulation(params);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to run simulation math engine.');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, runSimulation };
}
