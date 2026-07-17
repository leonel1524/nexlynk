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
          DEFAULT: '#232661',
          light: '#3478F3',
          dark: '#1a1e4d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
