'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Lock } from 'lucide-react';

export default function PublicationsPage() {
  const { user } = useAuthStore();
  const isPublisher = user?.role === 'Research Publisher';
  const [title, setTitle] = useState('');
  const [diseaseId, setDiseaseId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('disease_id', diseaseId);
      formData.append('file', file);
      await api.uploadPublication(formData);
      setSuccess(`"${title}" published successfully.`);
      setTitle(''); setDiseaseId(''); setFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || 'Upload failed.');
    } finally { setUploading(false); }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <UploadCloud className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-white">Research Hub</h2>
        </div>
        <p className="text-textSecondary text-sm mt-0.5">Publish epidemiological research papers and datasets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Upload Research Paper
          </h3>
          {!isPublisher ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-textMuted">
              <Lock className="w-10 h-10 opacity-40" />
              <div className="text-center">
                <p className="text-sm font-medium text-white">Publisher Access Required</p>
                <p className="text-xs mt-1">Only Research Publishers can upload papers.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-4">
              {success && (
                <div className="flex items-center gap-2.5 text-success text-sm bg-success/10 px-4 py-3 rounded-lg border border-success/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />{success}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2.5 text-danger text-sm bg-danger/10 px-4 py-3 rounded-lg border border-danger/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}
              <input type="text" placeholder="Research title" value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full bg-background border border-border px-4 py-3 rounded-lg text-sm text-white placeholder-textMuted focus:outline-none focus:border-primary transition-all" />
              <input type="text" placeholder="Disease ID (optional)" value={diseaseId} onChange={(e) => setDiseaseId(e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 rounded-lg text-sm text-white placeholder-textMuted focus:outline-none focus:border-primary transition-all" />
              <div onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
                {file ? (
                  <div className="flex flex-col items-center gap-2 text-primary">
                    <FileText className="w-8 h-8" />
                    <p className="text-sm font-medium">{file.name}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-textMuted">
                    <UploadCloud className="w-8 h-8 opacity-60" />
                    <p className="text-sm">Click to browse · PDF, DOC, TXT</p>
                  </div>
                )}
              </div>
              <button type="submit" disabled={uploading || !file}
                className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed">
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Publishing...</> : <><UploadCloud className="w-4 h-4" />Publish Research</>}
              </button>
            </form>
          )}
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-semibold text-white">Submission Guidelines</h3>
          {['All papers must include a disease profile association.','Data must be anonymized per research ethics.','PDF format preferred; max 50MB.','Published papers appear in the index within 24h.'].map((item, i) => (
            <p key={i} className="flex items-start gap-2 text-xs text-textSecondary">
              <span className="text-primary font-mono shrink-0">{String(i+1).padStart(2,'0')}.</span>{item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
