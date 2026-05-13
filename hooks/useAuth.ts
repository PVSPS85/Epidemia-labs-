
// hooks/useAuth.ts
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

export function useAuth() {
  const auth = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // This prevents Next.js hydration errors by waiting for the page to load
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return { isAuthenticated: false, user: null, logout: auth.logout };
  }

  return auth;
}