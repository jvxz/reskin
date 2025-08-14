import * as schema from '@@/server/db/schema'
import { and, eq } from 'drizzle-orm'
import z from 'zod'

export default defineAuthedEventHandler(async (event) => {
  const { id } = await validateZodBody(event, z.object({
    id: z.string(),
  }))

  await event.context.db.delete(schema.skins).where(
    and(
      eq(schema.skins.id, id),
      eq(schema.skins.userId, event.context.authData.user.id),
    ),
  )
})
