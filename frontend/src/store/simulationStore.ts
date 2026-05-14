// frontend/src/store/simulationStore.ts
import { create } from 'zustand';
import { SimulationResult } from '../types';

interface SimulationState {
  // Parameters
  population: number;
  r0: number;
  days: number;
  model: 'SIR' | 'SEIR';

  // Results
  results: SimulationResult[];
  isLoading: boolean;
  error: string | null;

  // Peak computed values (derived)
  peakInfected: number;
  peakDay: number;
  totalRecovered: number;
  activeInfected: number;

  // Actions
  setPopulation: (n: number) => void;
  setR0: (n: number) => void;
  setDays: (n: number) => void;
  setModel: (m: 'SIR' | 'SEIR') => void;
  setResults: (results: SimulationResult[]) => void;
  setLoading: (b: boolean) => void;
  setError: (e: string | null) => void;
  computePeaks: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  // Default parameters
  population: 1_000_000,
  r0: 2.5,
  days: 120,
  model: 'SIR',

  // Initial state
  results: [],
  isLoading: false,
  error: null,
  peakInfected: 0,
  peakDay: 0,
  totalRecovered: 0,
  activeInfected: 0,

  setPopulation: (n) => set({ population: n }),
  setR0: (n) => set({ r0: n }),
  setDays: (n) => set({ days: n }),
  setModel: (m) => set({ model: m }),

  setResults: (results) => {
    set({ results });
    get().computePeaks();
  },

  setLoading: (b) => set({ isLoading: b }),
  setError: (e) => set({ error: e }),

  computePeaks: () => {
    const { results } = get();
    if (!results.length) {
      set({ peakInfected: 0, peakDay: 0, totalRecovered: 0, activeInfected: 0 });
      return;
    }
    const peakInfected = Math.max(...results.map((d) => d.infected));
    const peakEntry = results.find((d) => d.infected === peakInfected);
    const lastEntry = results[results.length - 1];
    set({
      peakInfected,
      peakDay: peakEntry?.day ?? 0,
      totalRecovered: lastEntry?.recovered ?? 0,
      activeInfected: lastEntry?.infected ?? 0,
    });
  },
}));
