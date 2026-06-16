import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'md': '0 1px 4px 1px rgba(0, 0, 0, 0.09)',
        'inner-custom': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      colors: {
        rgba: 'rgba(0, 0, 0, 0.5)',

        // ── 커스텀 단색 ────────────────────────────────────────
        palePink:     '#ef6e85',
        coral:        '#f3907e',
        peach:        '#ecb38d',
        aqua:         '#a0ded0',
        paleAqua:     '#c0ebe1',
        purpler:      'rgb(44 29 83 / 88%)',
        purple2:      '#872ed1',
        lightestBlue: '#f8fcff',

        // ── 그레이 커스텀 스케일 ────────────────────────────────
        gray1: '#3b424b',
        gray2: '#68707d',
        gray3: '#949fab',
        gray4: '#c7cdd4',
        gray5: '#edf1f6',
        gray6: '#f7f9fb',

        // ── 기본 색상 + 커스텀 DEFAULT 유지 (shade도 사용 가능) ──

        // blue: DEFAULT=#4c88e9, bg-blue-600 등도 사용 가능
        blue: {
          DEFAULT: '#4c88e9',
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },

        // purple: DEFAULT=#967BDC, bg-purple-400 등도 사용 가능
        purple: {
          DEFAULT: '#967BDC',
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },

        // pink: DEFAULT=#ee415f
        pink: {
          DEFAULT: '#ee415f',
          50:  '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },

        // green: DEFAULT=#58ce97
        green: {
          DEFAULT: '#58ce97',
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },

        // orange: DEFAULT=#fc7d4a
        orange: {
          DEFAULT: '#fc7d4a',
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },

        // red: DEFAULT=#d14758
        red: {
          DEFAULT: '#d14758',
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },

        // black/white 커스텀
        black: '#242e39',
        white: '#ffffff',
      },
    }
  },
  plugins: [],
});
