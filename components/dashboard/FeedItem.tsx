import { Disease } from '@/types';
import Link from 'next/link';
import { ShieldAlert, Activity, Users } from 'lucide-react';

export default function FeedItem({ disease }: { disease: Disease }) {
  return (
    <Link href={`/disease/${disease.id}`}>
      <div className="bg-surface border border-border p-6 rounded-xl hover:border-primary/50 transition cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-white group-hover:text-primary transition">{disease.name}</h2>
            <p className="text-sm text-textSecondary uppercase tracking-wider mt-1">{disease.transmission} Transmission</p>
          </div>
          <div className="bg-danger/10 text-danger px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            R0: {disease.r0}
          </div>
        </div>
        
        <p className="text-textSecondary text-sm line-clamp-2 mb-4">
          {disease.description}
        </p>

        <div className="flex items-center gap-6 border-t border-border pt-4">
          <div className="flex items-center gap-2 text-sm text-textSecondary">
            <Activity className="w-4 h-4 text-primary" />
            <span>Mortality: {disease.mortality_rate}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-textSecondary">
            <Users className="w-4 h-4 text-susceptible" />
            <span>Population Base: {disease.population?.toLocaleString() || 'N/A'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
