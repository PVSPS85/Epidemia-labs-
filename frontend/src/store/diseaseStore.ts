import { create } from 'zustand';
import { api } from '@/lib/api';
import { Disease } from '@/types';

interface DiseaseState {
  diseases: Disease[];
  selectedDisease: Disease | null;
  isLoading: boolean;
  error: string | null;
  fetchDiseases: () => Promise<void>;
  fetchDiseaseById: (id: string) => Promise<void>;
}

export const useDiseaseStore = create<DiseaseState>((set) => ({
  diseases: [],
  selectedDisease: null,
  isLoading: false,
  error: null,

  fetchDiseases: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getDiseases();
      set({ diseases: response.data, isLoading: false });
    } catch (err: any) {
      // Don't show fake data — show proper empty state with error
      set({
        diseases: [],
        error: err.message || 'Failed to connect to server. Please ensure the backend is running.',
        isLoading: false,
      });
    }
  },

  fetchDiseaseById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getDiseaseById(id);
      set({ selectedDisease: response.data, isLoading: false });
    } catch (err: any) {
      set({
        selectedDisease: null,
        error: err.message || 'Disease not found or server unavailable.',
        isLoading: false,
      });
    }
  },
}));
