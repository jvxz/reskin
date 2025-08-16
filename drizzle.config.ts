import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // dbCredentials: {
  //   host: env.NUXT_DATABASE_URL,
  //   url: env.NUXT_DATABASE_URL,
  // },
  dialect: 'sqlite',
  out: './drizzle',
  schema: './server/db/schema.ts',
})
