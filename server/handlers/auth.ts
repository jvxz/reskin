import type { EventHandlerRequest, H3Event } from 'h3'
import type { auth } from '../auth'

type AuthedEventHandler<T extends EventHandlerRequest, D> = (event: H3Event<T> & {
  context: {
    authData: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>
  }
}) => Promise<D>

export function defineAuthedEventHandler<T extends EventHandlerRequest, D>(handler: AuthedEventHandler<T, D>) {
  return defineEventHandler(async (event) => {
    if (!event.context.authData) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    return await handler(event as H3Event<T> & {
      context: {
        authData: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>
      }
    })
  })
}
