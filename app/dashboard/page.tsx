'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Disease } from '@/types';
import FeedItem from '@/components/dashboard/FeedItem';
import TrendingPanel from '@/components/dashboard/TrendingPanel';
import SearchBar from '@/components/dashboard/SearchBar';
import FilterChips from '@/components/dashboard/FilterChips';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your Python backend!
    const fetchData = async () => {
      try {
        const response = await api.getDiseases();
        setDiseases(response.data);
      } catch (error) {
        console.error("Error fetching diseases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex justify-center p-6 gap-6">
      {/* Main Feed Column */}
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <SearchBar />
        <FilterChips />
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
        ) : (
          <div className="flex flex-col gap-4">
            {diseases.map((disease) => (
              <FeedItem key={disease.id} disease={disease} />
            ))}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-80">
        <TrendingPanel diseases={diseases} />
      </div>
    </div>
  );
}
