import { env } from 'node:process'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import * as schema from './db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  socialProviders: {
    github: {
      clientId: env.NUXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: env.NUXT_GITHUB_CLIENT_SECRET!,
    },
  },
})
