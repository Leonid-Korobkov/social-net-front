import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/zling-api\.up\.railway\.app\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5, // 5 минут
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/zling\.up\.railway\.app\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'site-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 часа
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Zling',
        short_name: 'Zling',
        description: 'Социальная сеть для людей, которые любят общаться',
        theme_color: '#9353D3',
        icons: [
          {
            src: 'src/assets/img/favicomatic/favicon-196x196.png',
            sizes: '196x196',
            type: 'image/png',
          },
          {
            src: 'src/assets/img/favicomatic/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'src/assets/img/favicomatic/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  define: {
    global: {},
  },
})
