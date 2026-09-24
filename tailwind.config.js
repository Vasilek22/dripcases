/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      bg: '#06060a',
    },
    keyframes: {
      blob: {
        '0%, 100%': { transform: 'translate(0,0) scale(1)' },
        '33%': { transform: 'translate(100px,-80px) scale(1.15)' },
        '66%': { transform: 'translate(-80px,100px) scale(0.9)' },
      },
    },
    animation: {
      blob: 'blob 24s infinite ease-in-out',
    },
  },
},
  plugins: [],
}