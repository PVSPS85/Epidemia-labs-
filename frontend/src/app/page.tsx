'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { api } from '@/lib/api';

/* ── Animated Network SVG Background ─────────────────────────────────────── */
const NODES = [
  { cx: 200, cy: 200 }, { cx: 80,  cy: 100 }, { cx: 320, cy: 80  },
  { cx: 350, cy: 280 }, { cx: 60,  cy: 300 }, { cx: 220, cy: 340 },
  { cx: 140, cy: 220 }, { cx: 280, cy: 160 },
];
const EDGES = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,6],[2,7],[3,5],[4,6],
];

function AnimatedNetwork() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <svg viewBox="0 0 400 400" className="w-[700px] h-[700px] opacity-[0.06]">
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].cx} y1={NODES[a].cy}
            x2={NODES[b].cx} y2={NODES[b].cy}
            stroke="#3B82F6" strokeWidth="1"
          />
        ))}
        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r={i === 0 ? 14 : 7}
              fill={i === 0 ? '#3B82F6' : 'none'}
              stroke={i === 0 ? '#3B82F6' : '#94A3B8'}
              strokeWidth="1.5" opacity={i === 0 ? 0.9 : 0.6}
            />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

/* ── Left Brand Panel ─────────────────────────────────────────────────────── */
function BrandPanel() {
  const avatars = [
    'https://i.pravatar.cc/40?img=1',
    'https://i.pravatar.cc/40?img=2',
    'https://i.pravatar.cc/40?img=3',
    'https://i.pravatar.cc/40?img=4',
    'https://i.pravatar.cc/40?img=5',
  ];

  return (
    <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 bg-base relative overflow-hidden border-r border-border">
      <AnimatedNetwork />

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-xl bg-action-primary/20 border border-action-primary/40 flex items-center justify-center text-action-primary font-bold text-lg shadow-glow-blue">
            E
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Epidemia<span className="text-action-primary">-Labs</span>
          </span>
        </div>

        <div className="space-y-6 max-w-md">
          <h1 className="text-display-lg leading-tight font-bold">
            Track. Simulate.<br />
            Publish.{' '}
            <span className="text-action-primary">Respond.</span>
          </h1>
          <p className="text-body-lg text-textSecondary leading-relaxed">
            Professional-grade epidemiological research platform for real-time disease tracking, SIR simulation modeling, and global outbreak analytics.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { emoji: '🔬', label: 'Peer-reviewed' },
              { emoji: '🌍', label: 'Live Maps' },
              { emoji: '📊', label: 'SIR Sims' },
            ].map(({ emoji, label }) => (
              <motion.span
                key={label}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-body-sm font-medium bg-surface border border-border text-textSecondary"
              >
                {emoji} {label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Trust footer */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Avatar stack */}
        <div className="flex -space-x-2.5">
          {avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-8 h-8 rounded-full border-2 border-base object-cover"
            />
          ))}
        </div>
        <div>
          <p className="text-body-sm font-semibold text-textPrimary">
            Exclusive Research Platform
          </p>
          <p className="text-[11px] text-textMuted">For verified epidemiologists &amp; health orgs</p>
        </div>
      </div>
    </div>
  );
}

/* ── Auth Card ────────────────────────────────────────────────────────────── */
export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen overflow-hidden bg-void text-textPrimary">
      <BrandPanel />

      {/* Right: Auth Card */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 bg-void relative">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-action-primary/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-[460px] bg-surface border border-border rounded-2xl p-10 shadow-card">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-action-primary/20 border border-action-primary/40 flex items-center justify-center text-action-primary font-bold shadow-glow-blue">
              E
            </div>
            <span className="text-xl font-bold tracking-tight">
              Epidemia<span className="text-action-primary">-Labs</span>
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center bg-base rounded-lg p-1 mb-8 border border-border">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-body-sm font-semibold rounded-md transition-all relative ${
                  tab === t
                    ? 'bg-surface text-textPrimary'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              <motion.div key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                <SignupForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ── Input wrapper ────────────────────────────────────────────────────────── */
const inputBase =
  'w-full bg-base border border-border rounded-lg py-2.5 pl-10 pr-4 text-body-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all';

function Divider() {
  return (
    <div className="relative flex items-center py-4">
      <div className="flex-grow border-t border-border" />
      <span className="flex-shrink-0 mx-4 text-[11px] text-textMuted uppercase tracking-widest">or</span>
      <div className="flex-grow border-t border-border" />
    </div>
  );
}

/* ── Login Form ───────────────────────────────────────────────────────────── */
function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.login(data.email, data.password);
      const { user, token } = res.data;
      setAuth({
        id: user.id,
        email: user.email,
        name: user.email.split('@')[0],
        role: user.role === 'Research Publisher' ? 'publisher' : 'viewer',
        avatar: '',
        savedDiseases: [],
      }, token);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
      <div>
        <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
          <input
            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            type="email" placeholder="researcher@epidemia.org"
            className={inputBase}
          />
        </div>
        {errors.email && <p className="text-[11px] text-sir-infected mt-1">Valid email required</p>}
      </div>

      <div>
        <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
          <input
            {...register('password', { required: true, minLength: 6 })}
            type={showPw ? 'text' : 'password'} placeholder="••••••••"
            className={inputBase}
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textPrimary transition-colors">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-[11px] text-sir-infected mt-1">Password must be ≥6 characters</p>}
      </div>

      <div className="flex items-center justify-between text-body-sm">
        <label className="flex items-center gap-2 text-textSecondary cursor-pointer">
          <input type="checkbox" className="rounded border-border bg-base text-action-primary focus:ring-action-primary" />
          Remember me
        </label>
        <button type="button" onClick={() => toast.info('Password reset email sent!')} className="text-action-primary hover:text-blue-400 font-medium transition-colors">
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-action-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-glow-blue flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
      </button>

      <Divider />

      <p className="text-center text-body-sm text-textMuted">
        Don&apos;t have an account? Switch to{' '}
        <span className="text-action-primary font-medium">Create Account</span> tab above.
      </p>
    </form>
  );
}

/* ── Signup Form ──────────────────────────────────────────────────────────── */
function SignupForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', role: 'viewer' as 'viewer' | 'publisher' },
  });
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const role = watch('role');

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const backendRole = data.role === 'publisher' ? 'Research Publisher' : 'Viewer';
      const res = await api.signup(data.email, data.password, backendRole);
      const { user, token } = res.data;
      setAuth({
        id: user.id,
        email: user.email,
        name: data.name || user.email.split('@')[0],
        role: data.role,
        avatar: '',
        savedDiseases: [],
      }, token);
      toast.success('Account created! Welcome to Epidemia-Labs.');
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Signup failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
          <input {...register('name', { required: true })} type="text" placeholder="Dr. Jane Smith" className={inputBase} />
        </div>
        {errors.name && <p className="text-[11px] text-sir-infected mt-1">Name required</p>}
      </div>

      <div>
        <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
          <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} type="email" placeholder="you@institution.org" className={inputBase} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input {...register('password', { required: true, minLength: 6 })} type="password" placeholder="••••••••" className={inputBase} />
          </div>
        </div>
        <div>
          <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Confirm</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input {...register('confirmPassword', { required: true })} type="password" placeholder="••••••••" className={inputBase} />
          </div>
        </div>
      </div>

      {/* Role selector */}
      <div>
        <label className="block text-body-sm font-medium text-textSecondary mb-2">Select Your Role</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'viewer',    emoji: '👁',  title: 'Researcher',  desc: 'Read & Explore' },
            { value: 'publisher', emoji: '📝', title: 'Publisher',   desc: 'Publish & Track' },
          ].map(({ value, emoji, title, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('role', value as 'viewer' | 'publisher')}
              className={`p-3 rounded-xl border text-left transition-all ${
                role === value
                  ? 'bg-action-primary/10 border-action-primary shadow-glow-blue'
                  : 'bg-base border-border hover:border-textMuted'
              }`}
            >
              <div className="text-body-sm font-semibold mb-0.5">{emoji} {title}</div>
              <div className="text-[11px] text-textSecondary">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-body-sm text-textSecondary cursor-pointer mt-2">
        <input type="checkbox" required className="rounded border-border bg-base text-action-primary focus:ring-action-primary" />
        I agree to the{' '}
        <button type="button" onClick={() => toast.info('Terms opened')} className="text-action-primary hover:underline">
          Terms &amp; Conditions
        </button>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-action-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-glow-blue flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
      </button>
    </form>
  );
}
