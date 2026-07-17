/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#232661',
          light: '#3478F3',
          dark: '#1a1e4d',
        },
      },
    },
  },
  plugins: [],
};
