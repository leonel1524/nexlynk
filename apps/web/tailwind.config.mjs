/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef0fa',
          100: '#d5d9f0',
          200: '#b0b7e2',
          300: '#8a94d3',
          400: '#6571c5',
          500: '#3b47a8',
          600: '#232661',
          700: '#1e2154',
          800: '#191c47',
          900: '#14173a',
        },
        brand: {
          DEFAULT: '#232661',
          light: '#3478F3',
          dark: '#1a1e4d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
