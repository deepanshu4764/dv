import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#050816',
        graphite: '#0f172a',
        platinum: '#e5e7eb',
        electric: '#4f7cff',
        aurora: '#8b5cf6'
      },
      boxShadow: {
        glow: '0 0 80px rgba(79, 124, 255, 0.24)',
        premium: '0 30px 90px rgba(0, 0, 0, 0.32)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
