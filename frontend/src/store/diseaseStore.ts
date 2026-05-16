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
      set({ error: err.message || 'Failed to fetch diseases', isLoading: false });
    }
  },

  fetchDiseaseById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getDiseaseById(id);
      set({ selectedDisease: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch disease details', isLoading: false });
    }
  },
}));
