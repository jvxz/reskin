import { auth } from '../auth'

export default defineEventHandler(async (event) => {
  const authData = event.context.authData ?? await auth.api.getSession(event)
  event.context.authData = authData

  const authApi = event.context.authApi ?? auth.api
  event.context.authApi = authApi
})
