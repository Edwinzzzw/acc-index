/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tier: {
          t0: '#ef4444', // 夯爆了 - 红
          t1: '#f59e0b', // 顶级 - 橙
          t2: '#3b82f6', // 人上人 - 蓝
          t3: '#6b7280', // NPC - 灰
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
