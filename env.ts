import { createEnv } from '@t3-oss/env-nuxt'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NUXT_PUBLIC_BETTER_AUTH_URL: z.url(),
    NUXT_PUBLIC_GITHUB_CLIENT_ID: z.string().min(1),
  },
  server: {
    BETTER_AUTH_SECRET: z.string().min(1),
    DATABASE_URL: z.url(),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
  },
})
