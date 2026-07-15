/** @type {import('tailwindcss').Config} */
const path = require('path');

module.exports = {
  content: [
    path.join(__dirname, 'src/**/*.{html,ts}'),
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#16a34a',
          light: '#22c55e',
          dark: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
