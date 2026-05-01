/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tier: {
          t0: '#ef4444',
          t1: '#f59e0b',
          t2: '#3b82f6',
          t3: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out',
      },
    },
  },
  plugins: [],
};
