// frontend/src/components/auth/SignupForm.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Viewer' | 'Research Publisher'>('Viewer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await apiClient.post('/auth/signup', { email, password, role });
      if (res.data.token) {
        setAuth(res.data.user, res.data.token);
        router.push('/dashboard');
      } else {
        setSuccess('Account created! Check your email to confirm, then sign in.');
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full">
      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2.5 text-danger text-sm bg-danger/10 px-4 py-3 rounded-lg border border-danger/20"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div
          role="status"
          className="flex items-center gap-2.5 text-success text-sm bg-success/10 px-4 py-3 rounded-lg border border-success/20"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
        <input
          id="signup-email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-border pl-10 pr-4 py-3 rounded-lg text-white placeholder-textMuted text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,209,255,0.1)] transition-all"
          required
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
        <input
          id="signup-password"
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-background border border-border pl-10 pr-4 py-3 rounded-lg text-white placeholder-textMuted text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,209,255,0.1)] transition-all"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>

      {/* Role selector */}
      <div className="relative">
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
        <select
          id="signup-role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'Viewer' | 'Research Publisher')}
          className="w-full bg-background border border-border px-4 py-3 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,209,255,0.1)] appearance-none cursor-pointer transition-all"
        >
          <option value="Viewer">Role: General Viewer</option>
          <option value="Research Publisher">Role: Research Publisher</option>
        </select>
      </div>

      {/* Role description */}
      <p className="text-xs text-textMuted -mt-2 pl-1">
        {role === 'Viewer'
          ? 'View simulations, maps, and disease data.'
          : 'Publish research papers and create simulations.'}
      </p>

      {/* Submit */}
      <button
        id="signup-submit"
        type="submit"
        disabled={loading || !!success}
        className="relative w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-purple hover:shadow-[0_0_24px_rgba(168,85,247,0.4)]"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating profile...
          </>
        ) : (
          'Initialize Profile →'
        )}
      </button>
    </form>
  );
}
