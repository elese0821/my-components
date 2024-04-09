import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 백엔드 서버 주소
        changeOrigin: true, // cross-origin 요청 허용
        // 필요한 경우 경로 재작성 설정 추가
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
