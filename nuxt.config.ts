import { env } from 'node:process'
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
  runtimeConfig: {
    BETTER_AUTH_SECRET: env.NUXT_BETTER_AUTH_SECRET,
    DATABASE_URL: env.NUXT_DATABASE_URL,
    GITHUB_CLIENT_SECRET: env.NUXT_GITHUB_CLIENT_SECRET,
    public: {
      baseURL: env.NUXT_PUBLIC_BETTER_AUTH_URL,
      githubClientId: env.NUXT_PUBLIC_GITHUB_CLIENT_ID,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
