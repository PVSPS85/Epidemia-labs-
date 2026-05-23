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
    const { beta, gamma, N, I0, days } = get();
    set({ isLoading: true, error: null });

    // Client-side SIR fallback function (Euler method)
    const runLocalSIR = (): SIRDataPoint[] => {
      const dt = 1;
      const data: SIRDataPoint[] = [];
      let S = N - I0;
      let I = I0;
      let R = 0;
      for (let day = 0; day <= days; day++) {
        data.push({ day, S: Math.round(S), I: Math.round(I), R: Math.round(R) });
        const dS = -(beta * S * I) / N * dt;
        const dI = ((beta * S * I) / N - gamma * I) * dt;
        const dR = gamma * I * dt;
        S += dS;
        I += dI;
        R += dR;
        if (S < 0) S = 0;
        if (I < 0) I = 0;
      }
      return data;
    };

    try {
      const r0 = gamma > 0 ? beta / gamma : 2.5;
      const response = await api.runSimulation({ population: N, r0, days });
      const mapped: SIRDataPoint[] = (response.data || []).map((pt: any) => ({
        day: pt.day,
        S: pt.susceptible,
        I: pt.infected,
        R: pt.recovered,
      }));
      if (mapped.length > 0) {
        set({ results: mapped, isLoading: false });
      } else {
        // Backend returned empty — use local fallback
        set({ results: runLocalSIR(), isLoading: false });
      }
    } catch (err: any) {
      // Backend failed — run simulation locally so graph always works
      console.warn('Backend simulation failed, running locally:', err.message);
      set({ results: runLocalSIR(), isLoading: false, error: null });
    }
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setResults: (results) => set({ results }),
}));
