'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { Activity } from 'lucide-react';
export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background relative overflow-hidden">
      
      {/* Dynamic background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-danger/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 p-8 bg-surface border border-border rounded-xl shadow-2xl shadow-black">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-background p-4 rounded-full border border-border mb-4">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Authentication</h1>
          <p className="text-textSecondary text-sm mt-2 text-center">
            Access the Epidemia-Labs global simulation grid.
          </p>
        </div>

        {/* Interface Toggle */}
        <div className="flex bg-background rounded-lg p-1 mb-6 border border-border">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              isLogin ? 'bg-surface text-primary shadow' : 'text-textSecondary hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              !isLogin ? 'bg-surface text-primary shadow' : 'text-textSecondary hover:text-white'
            }`}
          >
            Create Profile
          </button>
        </div>

        {isLogin ? <LoginForm /> : <SignupForm />}

        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-[10px] text-center text-textSecondary uppercase tracking-[0.2em]">
            Secure Encrypted Research Environment
          </p>
        </div>
      </div>
    </div>
  );
}