import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/v1': {
        target: 'https://api.hunyuan.cloud.tencent.com',
        changeOrigin: true,
      },
    },
  },
})
