'use client';

import { useAuthStore } from '@/store/authStore';
import StatChip from '@/components/dashboard/StatChip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Edit2, Archive, Eye, TrendingUp, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const mockPublications = [
  { id: '1', disease: 'Novel H5N1 Variant', status: 'Published', views: 12500, impactFactor: 4.8, date: '2026-05-10' },
  { id: '2', disease: 'Ebola Sudan Strain', status: 'Under Review', views: 0, impactFactor: 0, date: '2026-05-14' },
  { id: '3', disease: 'Marburg Outbreak', status: 'Published', views: 8900, impactFactor: 5.2, date: '2026-04-22' },
];

const mockChartData = [
  { month: 'Jan', views: 4000 },
  { month: 'Feb', views: 7000 },
  { month: 'Mar', views: 6500 },
  { month: 'Apr', views: 11000 },
  { month: 'May', views: 21400 },
];

export default function PublisherDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (user && user.role !== 'publisher') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'publisher') return null;

  return (
    <div className="max-w-[1200px] mx-auto pb-20 space-y-10">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-sm font-bold text-textPrimary mb-2">Publisher Analytics</h1>
          <p className="text-body-lg text-textSecondary">Manage your epidemiological publications and track impact.</p>
        </div>
        <Link 
          href="/publish/new" 
          className="px-6 py-3 bg-action-primary hover:bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-glow-blue"
        >
          <Plus className="w-5 h-5" /> Publish New Research
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatChip label="Total Impact" value={10.0} variant="purple" sub="Top 5% of authors" icon={<TrendingUp className="w-5 h-5" />} />
        <StatChip label="Active Publications" value={2} variant="blue" icon={<FileText className="w-5 h-5" />} />
        <StatChip label="Total Views" value={21400} variant="green" sub="+14% vs last month" icon={<Eye className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CHART */}
        <div className="lg:col-span-1 bg-bg-surface border border-bg-border rounded-2xl p-6 shadow-card h-[400px] flex flex-col">
          <h3 className="text-heading-sm font-semibold mb-6">Views by Month</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--bg-border)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--bg-border)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-raised)' }} 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--action-primary)' }}
                />
                <Bar dataKey="views" fill="var(--action-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLE */}
        <div className="lg:col-span-2 bg-bg-surface border border-bg-border rounded-2xl p-6 shadow-card overflow-hidden">
          <h3 className="text-heading-sm font-semibold mb-6">Your Publications</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-bg-border text-textSecondary uppercase tracking-wider font-mono text-[10px]">
                  <th className="pb-3 font-semibold">Disease</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Views</th>
                  <th className="pb-3 font-semibold">Impact</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {mockPublications.map((pub) => (
                  <tr key={pub.id} className="hover:bg-bg-raised transition-colors group">
                    <td className="py-4 font-medium text-textPrimary">{pub.disease}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                        pub.status === 'Published' 
                          ? 'bg-action-success/10 text-action-success border-action-success/20' 
                          : 'bg-action-warning/10 text-action-warning border-action-warning/20'
                      }`}>
                        {pub.status}
                      </span>
                    </td>
                    <td className="py-4 text-textSecondary font-mono">{pub.views.toLocaleString()}</td>
                    <td className="py-4 text-textSecondary font-mono">{pub.impactFactor.toFixed(1)}</td>
                    <td className="py-4 text-textSecondary">{pub.date}</td>
                    <td className="py-4 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-textSecondary hover:text-action-primary hover:bg-action-primary/10 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-textSecondary hover:text-action-danger hover:bg-action-danger/10 rounded-md transition-colors"><Archive className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
