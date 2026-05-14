// frontend/src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      setAuth(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
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

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
        <input
          id="login-email"
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
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-background border border-border pl-10 pr-4 py-3 rounded-lg text-white placeholder-textMuted text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,209,255,0.1)] transition-all"
          required
          autoComplete="current-password"
        />
      </div>

      {/* Submit */}
      <button
        id="login-submit"
        type="submit"
        disabled={loading}
        className="relative w-full bg-primary hover:bg-primary/90 text-background font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-cyan hover:shadow-[0_0_24px_rgba(0,209,255,0.4)]"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Authenticating...
          </>
        ) : (
          'Access Terminal →'
        )}
      </button>
    </form>
  );
}
