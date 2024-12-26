import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://eventio-alusium.grassbusinesslabs.uk', // Ваш бекенд
        changeOrigin: true,  // Змінює заголовок Origin на target
        rewrite: (path) => path.replace(/^\/api/, ''),  // Замінює '/api' на порожній шлях
        secure: false,  // Якщо використовуєте HTTPS, set false
      },
    },
  },
});

