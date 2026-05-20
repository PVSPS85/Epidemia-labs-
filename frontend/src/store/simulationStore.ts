import { create } from 'zustand';
import { api } from '@/lib/api';
import { SIRDataPoint } from '@/types';

interface SimulationState {
  // Parameters
  beta: number;
  gamma: number;
  N: number;
  I0: number;
  days: number;

  // Playback state
  isPlaying: boolean;

  // Results
  results: SIRDataPoint[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setParams: (params: Partial<{ beta: number; gamma: number; N: number; I0: number; days: number }>) => void;
  runSimulation: () => Promise<void>;
  togglePlay: () => void;
  setResults: (results: SIRDataPoint[]) => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  beta: 0.3,
  gamma: 0.1,
  N: 1000000,
  I0: 1,
  days: 120,

  isPlaying: false,

  results: [],
  isLoading: false,
  error: null,

  setParams: (params) => set((state) => ({ ...state, ...params })),

  runSimulation: async () => {
    const { beta, gamma, N, days } = get();
    set({ isLoading: true, error: null });
    try {
      // Backend expects { population, r0, days }
      // Convert beta/gamma back to r0 for the backend
      const r0 = gamma > 0 ? beta / gamma : 2.5;
      const response = await api.runSimulation({ population: N, r0, days });

      // Backend returns { day, susceptible, infected, recovered }
      // Frontend expects { day, S, I, R }
      const mapped: SIRDataPoint[] = (response.data || []).map((pt: any) => ({
        day: pt.day,
        S: pt.susceptible,
        I: pt.infected,
        R: pt.recovered,
      }));

      set({ results: mapped, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to run simulation', isLoading: false });
    }
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setResults: (results) => set({ results }),
}));
