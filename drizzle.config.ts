import { defineConfig } from 'drizzle-kit'
import { env } from './env'

export default defineConfig({
  dbCredentials: {
    host: env.NUXT_DATABASE_URL,
    url: env.NUXT_DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './drizzle',
  schema: './server/db/schema.ts',
})
