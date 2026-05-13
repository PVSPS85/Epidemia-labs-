'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import SubmissionHistory from '@/components/publish/SubmissionHistory';
import { FileText, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PublishDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Security check: Kick them out if they aren't logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        
        <div className="flex justify-between items-end border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              Publisher Portal
            </h1>
            <p className="text-textSecondary mt-2">Manage your epidemiological research submissions.</p>
          </div>
          
          {user.role === 'Research Publisher' ? (
            <Link href="/publish/new" className="bg-primary hover:bg-primary/90 text-background font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition">
              <Plus className="w-5 h-5" />
              Upload New Paper
            </Link>
          ) : (
            <div className="bg-surface border border-border px-4 py-2 rounded text-sm text-textSecondary">
              Viewer Access Only
            </div>
          )}
        </div>

        <SubmissionHistory />
      </div>
    </div>
  );
}
