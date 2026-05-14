// frontend/src/store/authStore.ts
'use client';

import { create } from 'zustand';
import { User } from '../types';

const TOKEN_KEY = 'epidemia_token';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      // Store user object too so we can rehydrate
      localStorage.setItem('epidemia_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('epidemia_user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Call this on app mount to rehydrate auth state from localStorage
  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem('epidemia_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        // Corrupted storage — clear it
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('epidemia_user');
      }
    }
  },
}));
