// hooks/useMapData.ts
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Disease } from '@/types';

export function useMapData() {
  const [epicenters, setEpicenters] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await api.getDiseases();
        setEpicenters(res.data);
      } catch (error) {
        console.error("Failed to load map data for radar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMapData();
  }, []);

  return { epicenters, loading };
}
