'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Activity, Shield, Map as MapIcon, BarChart2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen overflow-hidden bg-void text-textPrimary">
      {/* LEFT PANEL: BrandPanel */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 bg-base relative overflow-hidden border-r border-border">
        {/* Animated Network Graph Background */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0 opacity-10 flex items-center justify-center pointer-events-none"
        >
          <svg viewBox="0 0 400 400" className="w-[800px] h-[800px]">
            <circle cx="200" cy="200" r="180" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="200" cy="200" r="120" fill="none" stroke="#A855F7" strokeWidth="1" strokeDasharray="4 8" />
            <path d="M200 20 L200 380 M20 200 L380 200 M70 70 L330 330 M70 330 L330 70" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />
          </svg>
        </motion.div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-action-primary/20 border border-action-primary/40 text-action-primary font-bold shadow-glow-blue">
              E
            </div>
            <span className="text-2xl font-bold tracking-tight">Epidemia-Labs</span>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-display-lg leading-tight font-bold">
              Track. Simulate. Publish. <span className="text-action-primary">Respond.</span>
            </h1>
            <p className="text-body-lg text-textSecondary leading-relaxed">
              Professional-grade epidemiological research platform for real-time disease tracking, SIR simulation modeling, and global outbreak analytics.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mt-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-surface border border-border">
                <Shield className="w-4 h-4 text-action-primary" /> 🔬 Peer-reviewed
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-surface border border-border">
                <MapIcon className="w-4 h-4 text-action-success" /> 🌍 Live Maps
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-surface border border-border">
                <BarChart2 className="w-4 h-4 text-action-warning" /> 📊 SIR Sims
              </span>
            </div>
          </div>
        </div>


      </div>

      {/* RIGHT PANEL: AuthCard */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 bg-void relative">
        <div className="w-full max-w-[460px] bg-surface rounded-[24px] border border-border p-10 shadow-card">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-action-primary/20 border border-action-primary/40 text-action-primary font-bold shadow-glow-blue">
              E
            </div>
            <span className="text-xl font-bold tracking-tight">Epidemia-Labs</span>
          </div>

          <div className="flex items-center bg-base rounded-lg p-1 mb-8 border border-border">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'login' ? 'bg-surface text-textPrimary shadow-sm' : 'text-textSecondary hover:text-textPrimary'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'signup' ? 'bg-surface text-textPrimary shadow-sm' : 'text-textSecondary hover:text-textPrimary'}`}
            >
              Create Account
            </button>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SignupForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setAuth({
      id: '3',
      email: 'researcher@gmail.com',
      name: 'Google User',
      role: 'viewer',
      avatar: 'https://i.pravatar.cc/150?u=3',
      savedDiseases: []
    }, 'mock_token');
    toast.success('Successfully logged in with Google');
    router.push('/dashboard');
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // 800ms mock delay
    await new Promise(r => setTimeout(r, 800));
    
    // Set Zustand store mock user
    setAuth({
      id: '1',
      email: data.email,
      name: 'Dr. Jane Smith',
      role: 'viewer',
      avatar: 'https://i.pravatar.cc/150?u=1',
      savedDiseases: []
    }, 'mock_token');
    
    toast.success('Successfully logged in');
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
          <input
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            type="email"
            placeholder="researcher@epidemia.org"
            className="w-full bg-base border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
          />
        </div>
        {errors.email && <span className="text-xs text-action-danger mt-1">Valid email is required</span>}
      </div>

      <div>
        <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
          <input
            {...register("password", { required: true, minLength: 6 })}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full bg-base border border-border rounded-lg py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-textPrimary">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <span className="text-xs text-action-danger mt-1">Password must be at least 6 characters</span>}
      </div>

      <div className="flex items-center justify-between text-body-sm">
        <label className="flex items-center gap-2 cursor-pointer text-textSecondary hover:text-textPrimary">
          <input type="checkbox" className="rounded border-border bg-base text-action-primary focus:ring-action-primary" />
          Remember me
        </label>
        <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Password reset instructions sent to your email.'); }} className="text-action-primary hover:text-blue-400 font-medium">Forgot password?</a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-action-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-glow-blue flex items-center justify-center"
      >
        {isLoading ? <Activity className="w-5 h-5 animate-spin" /> : 'Sign In'}
      </button>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink-0 mx-4 text-xs text-textMuted uppercase tracking-wider">or continue with</span>
        <div className="flex-grow border-t border-border"></div>
      </div>

      <button type="button" onClick={handleGoogleAuth} disabled={isLoading} className="w-full h-12 bg-base border border-border hover:bg-surface text-textPrimary font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
        <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Google OAuth
      </button>
    </form>
  );
}

function SignupForm() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { role: 'viewer', name: '', email: '', password: '', confirmPassword: '' }
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const selectedRole = watch('role');

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setAuth({
      id: '4',
      email: 'publisher@gmail.com',
      name: 'Google Publisher',
      role: selectedRole || 'viewer',
      avatar: 'https://i.pravatar.cc/150?u=4',
      savedDiseases: []
    }, 'mock_token');
    toast.success('Google account linked successfully');
    router.push('/dashboard');
  };

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    setAuth({
      id: '2',
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: 'https://i.pravatar.cc/150?u=2',
      savedDiseases: []
    }, 'mock_token');
    
    toast.success('Account created successfully');
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Full Name</label>
        <input
          {...register("name", { required: true })}
          type="text"
          className="w-full bg-base border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
        />
      </div>

      <div>
        <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Email Address</label>
        <input
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          type="email"
          className="w-full bg-base border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Password</label>
          <input
            {...register("password", { required: true, minLength: 6 })}
            type="password"
            className="w-full bg-base border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
          />
        </div>
        <div>
          <label className="block text-body-sm font-medium text-textSecondary mb-1.5">Confirm</label>
          <input
            {...register("confirmPassword", { required: true })}
            type="password"
            className="w-full bg-base border border-border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
          />
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-body-sm font-medium text-textSecondary mb-2">Select Role</label>
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => setValue('role', 'viewer')}
            className={`cursor-pointer p-3 rounded-xl border ${selectedRole === 'viewer' ? 'bg-action-primary/10 border-action-primary shadow-glow-blue' : 'bg-base border-border hover:border-textMuted'} transition-all`}
          >
            <div className="text-sm font-semibold mb-1 flex items-center gap-2">👁 Researcher</div>
            <div className="text-[11px] text-textSecondary">Read & Explore data</div>
          </div>
          <div 
            onClick={() => setValue('role', 'publisher')}
            className={`cursor-pointer p-3 rounded-xl border ${selectedRole === 'publisher' ? 'bg-action-primary/10 border-action-primary shadow-glow-blue' : 'bg-base border-border hover:border-textMuted'} transition-all`}
          >
            <div className="text-sm font-semibold mb-1 flex items-center gap-2">📝 Publisher</div>
            <div className="text-[11px] text-textSecondary">Publish & Track research</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-body-sm mt-4">
        <input type="checkbox" required className="rounded border-border bg-base text-action-primary focus:ring-action-primary" />
        <span className="text-textSecondary">I agree to the <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Terms & Conditions document opened.'); }} className="text-action-primary hover:text-blue-400">Terms & Conditions</a></span>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 mt-2 bg-action-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-glow-blue flex items-center justify-center"
      >
        {isLoading ? <Activity className="w-5 h-5 animate-spin" /> : 'Create Account'}
      </button>

      <div className="relative flex items-center py-4 mt-2">
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink-0 mx-4 text-xs text-textMuted uppercase tracking-wider">or continue with</span>
        <div className="flex-grow border-t border-border"></div>
      </div>

      <button type="button" onClick={handleGoogleAuth} disabled={isLoading} className="w-full h-12 bg-base border border-border hover:bg-surface text-textPrimary font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
        <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Google OAuth
      </button>
    </form>
  );
}
