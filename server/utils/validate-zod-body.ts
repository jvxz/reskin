import type { H3Event } from 'h3'
import type { ZodType } from 'zod'
import { z } from 'zod'

export async function validateZodBody<T extends ZodType>(event: H3Event, schema: T): Promise<z.infer<T>> {
  const body = await readValidatedBody(event, schema.safeParse)

  if (!body.success) {
    throw createError({
      statusCode: 422,
      statusMessage: process.env.NODE_ENV === 'development' ? `Error parsing body: ${z.prettifyError(body.error)}` : 'Unprocessable Entity',
    })
  }

  return body.data
}
