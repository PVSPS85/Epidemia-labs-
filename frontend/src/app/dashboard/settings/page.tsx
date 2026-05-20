'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Mail, Shield, Key, Bell, LogOut, Lock } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[900px] mx-auto pb-16 space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-display-lg font-bold flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-action-primary" />
          Settings
        </h1>
        <p className="text-body-lg text-textSecondary mt-2">
          Manage your account preferences and profile settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-heading-md font-semibold mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-action-primary" />
          Profile
        </h2>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-raised flex items-center justify-center border border-border overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-textSecondary">
                {user?.name?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-heading-lg font-semibold text-textPrimary">{user?.name || 'Researcher'}</h3>
            <p className="text-body-sm text-textSecondary capitalize">{user?.role || 'viewer'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-raised rounded-xl border border-border">
            <Mail className="w-5 h-5 text-textMuted" />
            <div className="flex-1">
              <p className="text-[11px] text-textMuted uppercase tracking-wider font-semibold">Email</p>
              <p className="text-body-md text-textPrimary">{user?.email || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-raised rounded-xl border border-border">
            <Shield className="w-5 h-5 text-textMuted" />
            <div className="flex-1">
              <p className="text-[11px] text-textMuted uppercase tracking-wider font-semibold">Role</p>
              <p className="text-body-md text-textPrimary capitalize">{user?.role || 'Viewer'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="text-heading-md font-semibold mb-5 flex items-center gap-2">
          <Key className="w-5 h-5 text-action-primary" />
          Account
        </h2>
        <div className="space-y-3">
          {[
            { icon: Lock, label: 'Change Password', desc: 'Update your account password' },
            { icon: Bell, label: 'Notifications', desc: 'Configure alert preferences' },
            { icon: Key, label: 'API Keys', desc: 'Manage your API access tokens' },
          ].map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              onClick={() => {}}
              className="w-full flex items-center gap-4 p-4 bg-raised hover:bg-overlay rounded-xl border border-border transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-border group-hover:border-action-primary/30 transition-colors">
                <Icon className="w-5 h-5 text-textMuted group-hover:text-action-primary transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-body-md font-semibold text-textPrimary">{label}</p>
                <p className="text-body-sm text-textSecondary">{desc}</p>
              </div>
              <span className="text-[11px] text-textMuted bg-surface px-2.5 py-1 rounded-full border border-border">Coming Soon</span>
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-surface border border-sir-infected/20 rounded-2xl p-6">
        <h2 className="text-heading-md font-semibold mb-4 text-sir-infected flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-body-sm text-textSecondary mb-5">
          Logging out will clear your session and return you to the login page.
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-sir-infected/10 hover:bg-sir-infected/20 text-sir-infected border border-sir-infected/30 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </motion.div>
  );
}
