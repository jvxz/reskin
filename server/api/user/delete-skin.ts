import * as schema from '@@/server/db/schema'
import { and, eq } from 'drizzle-orm'

const BodySchema = UserSkinSchema

export default defineAuthedEventHandler(async (event) => {
  const skin = await validateZodBody(event, BodySchema)

  if (skin.userId !== event.context.authData.user.id) {
    throw createError({
      message: 'You are not authorized to delete this skin',
      statusCode: 403,
    })
  }

  await event.context.db.delete(schema.skins).where(
    and(
      eq(schema.skins.id, skin.id),
      eq(schema.skins.userId, event.context.authData.user.id),
    ),
  )

  const skinUrlId = skin.skinUrl.split('/').pop()
  const thumbnailUrlId = skin.thumbnailUrl.split('/').pop()

  if (!skinUrlId || !thumbnailUrlId) {
    throw createError({
      message: 'An unknown error occurred while deleting the skin',
      statusCode: 500,
    })
  }

  const res = await event.context.ut.deleteFiles([skinUrlId, thumbnailUrlId])

  if (!res.success) {
    throw createError({
      cause: res,
      message: 'An unknown error occurred while deleting the skin',
      statusCode: 500,
    })
  }
})
