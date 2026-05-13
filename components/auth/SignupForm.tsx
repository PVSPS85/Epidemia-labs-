// components/auth/SignupForm.tsx
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
      setAuth(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full">
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
        placeholder="Secure Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-background border border-border p-3 rounded text-textPrimary focus:outline-none focus:border-primary transition"
        required
      />

      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value as 'Viewer' | 'Research Publisher')}
        className="bg-background border border-border p-3 rounded text-textPrimary focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
      >
        <option value="Viewer">Role: General Viewer</option>
        <option value="Research Publisher">Role: Research Publisher</option>
      </select>
      
      <button 
        type="submit" 
        disabled={loading}
        className="bg-primary hover:bg-primary/90 text-background font-bold p-3 rounded flex justify-center items-center transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Initialize Profile'}
      </button>
    </form>
  );
}
