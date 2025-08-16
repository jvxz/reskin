import { UTApi } from 'uploadthing/server'
import { env } from '~~/env'

export default defineEventHandler(async (event) => {
  const ut = event.context.ut ?? new UTApi({ token: env.UPLOADTHING_TOKEN })
  event.context.ut = ut
})
