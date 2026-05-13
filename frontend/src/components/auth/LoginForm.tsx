// frontend/src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">
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
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-[#0d1117] border border-[#30363d] p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold p-3 rounded-lg flex justify-center items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Terminal'}
      </button>
    </form>
  );
}
