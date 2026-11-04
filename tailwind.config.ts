import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "Midnight Pro" ink scale — navy-tinted replacement for the default
        // gray palette. Light steps stay pale blue-grey; dark steps are the
        // deep-navy surface ladder (950 page → 900 card → 800 elevated).
        gray: {
          50: '#f5f8fd',
          100: '#e9eff9',
          200: '#d7e1f0',
          300: '#b9c9e2',
          400: '#90a7cb',
          500: '#59708f',
          600: '#42557a',
          700: '#2b3c5b',
          800: '#16233c',
          900: '#101a2e',
          950: '#0a1120',
        },
        brand: {
          50: '#eef6ff',
          100: '#dcebfd',
          200: '#bed9ff',
          300: '#8fb9fb',
          400: '#5b97f5',
          500: '#1e6fe8',
          600: '#1559c7',
          700: '#0f4c9c',
          800: '#0e3d79',
          900: '#0f3263',
          950: '#0a2247',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6c0a',
          700: '#c2570a',
          800: '#9a4510',
          900: '#7c3a10',
        },
        surface: {
          light: '#ffffff',
          subtle: '#f5f8fd',
          muted: '#e9eff9',
          border: '#d7e1f0',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.68,-0.55,0.27,1.55)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        'converter': '0 8px 32px rgba(30,111,232,0.14), 0 2px 8px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e6fe8' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
