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
    },
  },
  plugins: [daisyui],
}
