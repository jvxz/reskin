import tailwindcss from '@tailwindcss/vite'

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
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    'reka-ui/nuxt',
    '@compodium/nuxt',
    '@nuxtjs/color-mode',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
