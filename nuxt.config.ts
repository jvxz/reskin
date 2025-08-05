// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  eslint: {
    config: {
      import: false,
      standalone: false,
    },
  },
  modules: ['@nuxt/eslint', '@nuxt/fonts'],
})
