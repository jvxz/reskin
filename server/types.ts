import type { UTApi } from 'uploadthing/server'
import type { auth } from './auth'

declare module 'h3' {
  interface H3EventContext {
    authData?: Awaited<ReturnType<typeof auth.api.getSession>>
    authApi: typeof auth.api
    ut: UTApi
  }
}

export default {}
