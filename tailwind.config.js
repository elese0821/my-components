/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'md': '0 1px 4px 1px rgba(0, 0, 0, 0.2)',
      },
      colors: {
        pink: '#ee415f',
        green: '#58ce97',
        orange: '#fc7d4a',
        red: '#d14758',
        palePink: '#ef6e85',
        coral: '#f3907e',
        peach: '#ecb38d',
        aqua: '#a0ded0',
        paleAqua: '#c0ebe1',
        lightestBlue: '#f8fcff',
        blue: '#4c88e9',
        black: '#242e39',
        gray1: '#3b424b',
        gray2: '#68707d',
        gray3: '#949fab',
        gray4: '#c7cdd4',
        gray5: '#edf1f6',
        gray6: '#f7f9fb',
        white: '#ffffff',
      },
    }
  },
  variants: {},
  plugins: [],
}

