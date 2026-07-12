import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'The Bakins',
        short_name: 'The Bakins',
        description: 'Home made, eggless, 100% vegetarian cakes — browse the menu and order.',
        theme_color: '#52683f',
        background_color: '#fdf8f0',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Only precache the app shell (JS/CSS/HTML/icons). Firestore/Auth
        // requests stay live over the network — never cached — so the menu
        // and admin dashboard always reflect real data, never stale offline data.
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,ico}'],
      },
    }),
  ],
})
