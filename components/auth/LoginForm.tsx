// components/auth/LoginForm.tsx
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
      // Connects directly to the FastAPI backend you built!
      const res = await apiClient.post('/auth/login', { email, password });
      
      // If successful, save token and user data
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
      {error && <div className="text-danger text-sm bg-danger/10 p-3 rounded border border-danger/20">{error}</div>}
      
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-background border border-border p-3 rounded text-textPrimary focus:outline-none focus:border-primary transition"
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-background border border-border p-3 rounded text-textPrimary focus:outline-none focus:border-primary transition"
        required
      />
      
      <button 
        type="submit" 
        disabled={loading}
        className="bg-primary hover:bg-primary/90 text-background font-bold p-3 rounded flex justify-center items-center transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Terminal'}
      </button>
    </form>
  );
}
