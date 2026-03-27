import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(() => {
  return {
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_DEV_API_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      vueDevTools(),
      vue(),
      tailwindcss(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifest: {
          name: 'MediaLog',
          short_name: 'MediaLog',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
        '@common': fileURLToPath(new URL('./src/common', import.meta.url)),
        '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
        '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      },
    },
  }
})
