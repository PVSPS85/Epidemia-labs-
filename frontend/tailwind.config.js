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
        'surface-2': 'var(--bg-raised)',

        sir: {
          susceptible: 'var(--sir-susceptible)',
          infected:    'var(--sir-infected)',
          recovered:   'var(--sir-recovered)',
        },

        action: {
          primary:        'var(--action-primary)',
          'primary-glow': 'var(--action-primary-glow)',
          danger:         'var(--action-danger)',
          success:        'var(--action-success)',
          warning:        'var(--action-warning)',
        },

        textPrimary:   'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted:     'var(--text-muted)',
        textAccent:    'var(--text-accent)',
      },

      fontFamily: {
        sans:    ['var(--font-poppins)', 'ui-sans-serif', 'sans-serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-poppins)', 'ui-sans-serif', 'sans-serif'],
      },

      fontSize: {
        'display-xl': ['48px', { fontWeight: '700', letterSpacing: '-0.02em',  lineHeight: '1.1'  }],
        'display-lg': ['36px', { fontWeight: '700', letterSpacing: '-0.015em', lineHeight: '1.15' }],
        'heading-xl': ['28px', { fontWeight: '600', letterSpacing: '-0.01em',  lineHeight: '1.25' }],
        'heading-lg': ['22px', { fontWeight: '600', letterSpacing: '-0.01em',  lineHeight: '1.3'  }],
        'heading-md': ['18px', { fontWeight: '600', letterSpacing: '0',        lineHeight: '1.4'  }],
        'body-lg':    ['16px', { fontWeight: '400', letterSpacing: '0.01em',   lineHeight: '1.7'  }],
        'body-md':    ['14px', { fontWeight: '400', letterSpacing: '0.01em',   lineHeight: '1.6'  }],
        'body-sm':    ['13px', { fontWeight: '400', letterSpacing: '0.015em',  lineHeight: '1.5'  }],
      },

      boxShadow: {
        'glow-red':    'var(--glow-red)',
        'glow-yellow': 'var(--glow-yellow)',
        'glow-green':  'var(--glow-green)',
        'glow-blue':   'var(--glow-blue)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
      },

      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'shimmer':    'shimmer 1.5s infinite',
        'ping-slow':  'ping 2s cubic-bezier(0,0,0.2,1) infinite',
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
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
