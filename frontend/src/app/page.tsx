'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { Activity, Zap, Globe, Shield } from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, hydrateFromStorage } = useAuthStore();
  const router = useRouter();

  // Rehydrate auth state from localStorage on first render
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex">
      {/* ── Animated ambient background ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Left panel: Branding / Feature showcase ──────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-glow-cyan">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">Epidemia</span>
            <span className="text-lg font-light text-textSecondary ml-1">Labs</span>
          </div>
          <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] font-mono bg-success/20 text-success border border-success/30 uppercase tracking-widest">
            Live
          </span>
        </div>

        {/* Main headline */}
        <div className="space-y-6 animate-fade-in">
          <div>
            <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase mb-3">
              Global Epidemiological Intelligence
            </p>
            <h1 className="text-5xl font-bold leading-tight">
              <span className="text-white">Disease Spread</span>
              <br />
              <span className="gradient-text">Simulation</span>
              <br />
              <span className="text-white">Platform</span>
            </h1>
            <p className="mt-4 text-textSecondary text-lg leading-relaxed max-w-md">
              Model epidemic trajectories with SIR/SEIR dynamics. Real-time analytics,
              predictive outbreak mapping, and collaborative research tools.
            </p>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Zap, label: 'Real-Time SIR Modeling', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
              { icon: Globe, label: 'Global Outbreak Map', color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20' },
              { icon: Shield, label: 'Research Hub', color: 'text-success', bg: 'bg-success/10 border-success/20' },
            ].map(({ icon: Icon, label, color, bg }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${bg} ${color}`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </span>
            ))}
          </div>


        </div>

        {/* Bottom footer */}
        <p className="text-xs text-textMuted font-mono">
          © 2026 Epidemia-Labs Research Initiative
        </p>
      </div>

      {/* ── Right panel: Auth card ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile-only logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">Epidemia Labs</span>
          </div>

          {/* Card */}
          <div className="glass-strong rounded-2xl p-8 shadow-card">
            {/* Card header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">System Access</h2>
              <p className="text-textSecondary text-sm mt-1.5">
                Sign in or register to access the simulation grid.
              </p>
            </div>

            {/* Tab selector */}
            <div className="flex bg-background rounded-xl p-1 mb-6 border border-border">
              <button
                id="tab-login"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-surface text-primary shadow-sm ring-glow-cyan'
                    : 'text-textSecondary hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                id="tab-signup"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'signup'
                    ? 'bg-surface text-primary shadow-sm ring-glow-cyan'
                    : 'text-textSecondary hover:text-white'
                }`}
              >
                Create Profile
              </button>
            </div>

            {/* Form */}
            <div className="animate-fade-in">
              {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
            </div>

            {/* Divider + footer */}
            <div className="mt-6 pt-5 border-t border-border/40">
              <p className="text-[10px] text-center text-textMuted font-mono uppercase tracking-[0.2em]">
                🔒 &nbsp;Encrypted Research Environment &nbsp;·&nbsp; Epidemia-Labs v2.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
