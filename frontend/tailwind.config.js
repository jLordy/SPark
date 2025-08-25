/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tesla: ['TESLA', 'sans-serif'],
        bakbak: ['BakbakOne', 'sans-serif'],
      },
      colors: {
        brandGray: {
          DEFAULT: '#65717C',
          light: '#7B8790',
          dark: '#505A62',
        },
        brandBlack: '#121416',
        brandGreen: '#64DE85'
      },
    },

  },
  plugins: [daisyui],
}
