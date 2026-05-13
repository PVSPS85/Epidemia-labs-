// frontend/src/components/auth/SignupForm.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Viewer' | 'Research Publisher'>('Viewer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/auth/signup', { email, password, role });
      // If Supabase requires email confirmation, token may be empty
      if (res.data.token) {
        setAuth(res.data.user, res.data.token);
        router.push('/dashboard');
      } else {
        setError('Account created! Please check your email to confirm, then log in.');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full">
      {error && (
        <div className="text-yellow-400 text-sm bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
        required
      />

      <input
        type="password"
        placeholder="Secure Password (min. 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
        required
        minLength={6}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as 'Viewer' | 'Research Publisher')}
        className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors appearance-none cursor-pointer"
      >
        <option value="Viewer">Role: General Viewer</option>
        <option value="Research Publisher">Role: Research Publisher</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold p-3 rounded-lg flex justify-center items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Initialize Profile'}
      </button>
    </form>
  );
}
