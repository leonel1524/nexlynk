/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#16a34a',
          dark: '#15803d',
          light: '#22c55e',
        },
      },
    },
  },
  plugins: [],
};
