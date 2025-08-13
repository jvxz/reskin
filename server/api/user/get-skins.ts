import { eq } from 'drizzle-orm'
import { skins } from '~~/server/db/schema'

export default defineAuthedEventHandler(async (event) => {
  const user = event.context.authData.user

  const userSkins = await event.context.db.query.skins.findMany({
    where: eq(skins.userId, user.id),
  })

  return userSkins
})
