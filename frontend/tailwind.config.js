/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic design tokens — these must match every className used in JSX
        background:    '#0B0E14',
        surface:       '#11141D',
        'surface-2':   '#161B27',
        border:        '#1C212B',
        muted:         '#30363d',

        primary:       '#00D1FF',   // cyan accent
        secondary:     '#A855F7',   // purple accent
        success:       '#22C55E',
        warning:       '#EAB308',
        danger:        '#EF4444',

        textPrimary:   '#FFFFFF',
        textSecondary: '#9CA3AF',
        textMuted:     '#6B7280',

        // Legacy brand tokens (keep for backward compat)
        brand: {
          green:  '#00ff88',
          blue:   '#0088ff',
          dark:   '#010409',
          card:   '#0d1117',
          border: '#21262d',
          muted:  '#30363d',
        },
      },

      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Inter', 'ui-sans-serif', 'sans-serif'],
      },

      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern':
          'linear-gradient(rgba(28,33,43,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(28,33,43,0.6) 1px, transparent 1px)',
      },

      backgroundSize: {
        'grid': '40px 40px',
      },

      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow':   'pulseGlow 2s ease-in-out infinite',
        'fade-in':      'fadeIn 0.4s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'float':        'float 6s ease-in-out infinite',
        'scan':         'scan 4s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },

      boxShadow: {
        'glow-cyan':   '0 0 20px rgba(0,209,255,0.25), 0 0 40px rgba(0,209,255,0.10)',
        'glow-purple': '0 0 20px rgba(168,85,247,0.25), 0 0 40px rgba(168,85,247,0.10)',
        'glow-green':  '0 0 20px rgba(0,255,136,0.25), 0 0 40px rgba(0,255,136,0.10)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.05)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
      },

      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
