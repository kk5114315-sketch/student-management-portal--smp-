/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
        night: { 900: '#0b1020', 800: '#111833', 700: '#1a2347' },
      },
    },
  },
  plugins: [],
};
