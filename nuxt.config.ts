import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

import './env'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/globals.css'],
  devtools: { enabled: true },

  eslint: {
    config: {
      import: false,
      standalone: false,
    },
  },

  imports: {
    dirs: [
      '~/server/utils',
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    'reka-ui/nuxt',
    '@compodium/nuxt',
    '@nuxtjs/color-mode',
    'vue-sonner/nuxt',
    '@uploadthing/nuxt',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@nuxt/image',
    'vue-sonner/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],
  vite: {
    plugins: [
      tailwindcss(),
      nodePolyfills(),
    ],
  },
})
