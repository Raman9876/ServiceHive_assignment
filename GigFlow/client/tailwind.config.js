/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // NEXUS//OS Inspired Color Palette
        nexus: {
          black: '#0a0a0a',
          darker: '#0d0d0d',
          dark: '#111111',
          card: '#141414',
          border: '#1a1a1a',
          muted: '#252525',
        },
        accent: {
          orange: '#ff4d00',
          'orange-hover': '#ff6b2c',
          'orange-glow': 'rgba(255, 77, 0, 0.5)',
        },
        glow: {
          cyan: '#00d4ff',
          'cyan-soft': 'rgba(0, 212, 255, 0.15)',
          teal: '#0d9488',
        },
        status: {
          online: '#22c55e',
          offline: '#ef4444',
          warning: '#f59e0b',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1a1',
          muted: '#666666',
          dark: '#404040',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'shimmer-dark': 'shimmerDark 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-cyan': 'glowCyan 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'marquee': 'marquee 30s linear infinite',
        'scan': 'scan 2s linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        shimmerDark: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 77, 0, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 77, 0, 0.6), 0 0 60px rgba(255, 77, 0, 0.3)' },
        },
        glowCyan: {
          '0%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.2)' },
          '100%': { boxShadow: '0 0 80px rgba(0, 212, 255, 0.3), 0 0 120px rgba(0, 212, 255, 0.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -3px rgba(0, 0, 0, 0.1), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        glow: '0 0 20px rgba(255, 77, 0, 0.4)',
        'glow-lg': '0 0 30px rgba(255, 77, 0, 0.5), 0 0 60px rgba(255, 77, 0, 0.2)',
        'glow-cyan': '0 0 40px rgba(0, 212, 255, 0.3)',
        'glow-cyan-lg': '0 0 60px rgba(0, 212, 255, 0.4), 0 0 100px rgba(0, 212, 255, 0.2)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'nexus-card': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'nexus-grid': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'nexus-glow': 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
