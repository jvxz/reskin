import type { UTApi } from 'uploadthing/server'
import type { auth } from './auth'
import type { db } from './db'

declare module 'h3' {
  interface H3EventContext {
    authData?: Awaited<ReturnType<typeof auth.api.getSession>>
    authApi: typeof auth.api
    ut: UTApi
    db: typeof db
  }
}

export default {}
