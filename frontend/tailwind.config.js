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
        void:        'var(--bg-void)',
        base:        'var(--bg-base)',
        surface:     'var(--bg-surface)',
        raised:      'var(--bg-raised)',
        overlay:     'var(--bg-overlay)',
        border:      'var(--bg-border)',

        sir: {
          susceptible: 'var(--sir-susceptible)',
          infected:    'var(--sir-infected)',
          recovered:   'var(--sir-recovered)',
        },

        action: {
          primary:      'var(--action-primary)',
          'primary-glow': 'var(--action-primary-glow)',
          danger:       'var(--action-danger)',
          success:      'var(--action-success)',
          warning:      'var(--action-warning)',
        },

        textPrimary:   'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted:     'var(--text-muted)',
        textAccent:    'var(--text-accent)',
      },

      fontFamily: {
        sans:    ['var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },

      boxShadow: {
        'glow-red':    'var(--glow-red)',
        'glow-yellow': 'var(--glow-yellow)',
        'glow-green':  'var(--glow-green)',
        'glow-blue':   'var(--glow-blue)',
      },

      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':      'fadeIn 0.4s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
