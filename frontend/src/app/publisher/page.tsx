'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Plus, Edit2, Archive, Eye, FileText,
  TrendingUp, Users, BookOpen, CheckCircle2,
  Clock, XCircle, AlertCircle, ServerCrash, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_CONFIG = {
  live:     { label: 'Live',     color: 'text-sir-recovered',   bg: 'bg-sir-recovered/10',   border: 'border-sir-recovered/20',   icon: CheckCircle2 },
  draft:    { label: 'Draft',    color: 'text-sir-susceptible', bg: 'bg-sir-susceptible/10', border: 'border-sir-susceptible/20', icon: Clock },
  review:   { label: 'In Review', color: 'text-action-primary', bg: 'bg-action-primary/10',  border: 'border-action-primary/20',  icon: AlertCircle },
  removed:  { label: 'Removed',  color: 'text-sir-infected',    bg: 'bg-sir-infected/10',    border: 'border-sir-infected/20',    icon: XCircle },
};

function SkeletonRow() {
  return (
    <tr>
      {[1,2,3,4,5,6].map(i => (
        <td key={i} className="py-4 px-2">
          <div className="h-4 skeleton rounded" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function PublisherDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [publications, setPublications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Route guard
  useEffect(() => {
    if (user && user.role !== 'publisher') router.push('/dashboard');
  }, [user, router]);

  const fetchPublications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getPublications();
      const data = Array.isArray(res.data) ? res.data : [];
      // Filter to only this user's publications
      const mine = data.filter((p: any) => !p.author_id || p.author_id === user?.id);
      setPublications(mine);
    } catch (err: any) {
      setError(err.message || 'Failed to load publications.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.role === 'publisher') fetchPublications();
  }, [fetchPublications, user?.role]);

  if (!user || user.role !== 'publisher') return null;

  // Compute stats from real data
  const totalViews  = publications.reduce((a, p) => a + (p.views || 0), 0);
  const liveCount   = publications.filter(p => p.status === 'live' || p.status === 'published').length;
  const draftCount  = publications.filter(p => p.status === 'draft').length;

  // Build analytics chart from publications dates
  const chartData = (() => {
    const months: Record<string, number> = {};
    publications.forEach(p => {
      if (p.date || p.created_at) {
        const d = new Date(p.date || p.created_at);
        const key = d.toLocaleDateString('en-US', { month: 'short' });
        months[key] = (months[key] || 0) + (p.views || 0);
      }
    });
    return Object.entries(months).map(([month, views]) => ({ month, views }));
  })();

  return (
    <div className="max-w-[1200px] mx-auto pb-20 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-display-lg font-bold text-textPrimary">Publisher Dashboard</h1>
          <p className="text-body-md text-textSecondary mt-1">
            Manage your research publications and track their impact.
          </p>
        </div>
        <Link
          href="/publish/new"
          className="flex items-center gap-2 px-6 py-3 bg-action-primary hover:bg-blue-600 text-white font-semibold rounded-xl shadow-glow-blue transition-colors text-body-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Publish New Research
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Publications', value: publications.length, icon: BookOpen,    color: 'text-action-primary',  bg: 'bg-action-primary/10' },
          { label: 'Total Views',        value: totalViews,          icon: Eye,         color: 'text-sir-recovered',   bg: 'bg-sir-recovered/10' },
          { label: 'Live Papers',        value: liveCount,           icon: CheckCircle2, color: 'text-sir-recovered',  bg: 'bg-sir-recovered/10' },
          { label: 'Drafts',            value: draftCount,           icon: Clock,        color: 'text-sir-susceptible', bg: 'bg-sir-susceptible/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-surface border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`${bg} ${color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-body-sm text-textSecondary">{label}</span>
            </div>
            <p className={`text-display-xl font-bold ${color} tabular-nums`}>
              {isLoading ? '—' : value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Analytics chart */}
        {chartData.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col">
            <h3 className="text-heading-md font-semibold mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-action-primary" />
              Views Over Time
            </h3>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}k` : String(v)} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: '10px' }}
                    itemStyle={{ color: 'var(--action-primary)' }}
                    labelStyle={{ color: 'var(--text-muted)' }}
                  />
                  <Line type="monotone" dataKey="views" stroke="var(--action-primary)" strokeWidth={2} dot={{ fill: 'var(--action-primary)', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Publications table */}
        <div className={`${chartData.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'} bg-surface border border-border rounded-2xl p-6 overflow-hidden`}>
          <h3 className="text-heading-md font-semibold mb-5 flex items-center gap-2">
            <FileText className="w-5 h-5 text-action-primary" />
            Your Publications
          </h3>

          {error ? (
            <div className="flex flex-col items-center py-12 text-center">
              <ServerCrash className="w-10 h-10 text-textMuted mb-3" />
              <p className="text-body-sm text-textSecondary mb-4">{error}</p>
              <button onClick={fetchPublications} className="flex items-center gap-2 px-4 py-2 text-action-primary border border-action-primary/30 rounded-lg text-body-sm hover:bg-action-primary/10 transition-colors">
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-textMuted text-[10px] font-semibold uppercase tracking-widest">
                    <th className="pb-3">#</th>
                    <th className="pb-3">Title / Disease</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Views</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                  ) : publications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <BookOpen className="w-8 h-8 text-textMuted mx-auto mb-3" />
                        <p className="text-body-sm text-textMuted">No publications yet.</p>
                        <Link href="/publish/new" className="text-body-sm text-action-primary hover:underline mt-1 inline-block">
                          Publish your first research →
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    publications.map((pub, i) => {
                      const statusKey = (pub.status || 'draft').toLowerCase() as keyof typeof STATUS_CONFIG;
                      const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.draft;
                      const StatusIcon = cfg.icon;
                      return (
                        <tr key={pub.id || i} className="hover:bg-raised transition-colors group">
                          <td className="py-4 text-body-sm text-textMuted font-mono">{i + 1}</td>
                          <td className="py-4">
                            <p className="text-body-sm font-semibold text-textPrimary">
                              {pub.title || pub.disease || pub.name || 'Untitled'}
                            </p>
                            {pub.disease && pub.title && (
                              <p className="text-[11px] text-textMuted">{pub.disease}</p>
                            )}
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                              <StatusIcon className="w-3 h-3" />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="py-4 text-body-sm text-textSecondary font-mono">
                            {(pub.views || 0).toLocaleString()}
                          </td>
                          <td className="py-4 text-body-sm text-textSecondary">
                            {pub.date || pub.created_at
                              ? new Date(pub.date || pub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : '—'}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-textMuted hover:text-action-primary hover:bg-action-primary/10 rounded-md transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-textMuted hover:text-sir-infected hover:bg-sir-infected/10 rounded-md transition-colors">
                                <Archive className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
