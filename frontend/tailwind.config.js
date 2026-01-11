/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          light: '#f8fafc',
          dark: '#030712',
          gray: '#1e293b',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          pink: '#ec4899',
          yellow: '#eab308',
          green: '#22c55e',
          red: '#ef4444',
          glass: 'rgba(15, 23, 42, 0.6)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
        'neon-purple': '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [],
}
