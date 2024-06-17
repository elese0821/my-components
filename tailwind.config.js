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
      }
    }
  },
  variants: {
    extend: {
      // 스크롤바 유틸리티 활성화
      scrollbar: ['rounded', 'hover'],
    },
  },
}

