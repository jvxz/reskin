import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { skins } from '~~/server/db/schema'
import { defineAuthedEventHandler } from '~~/server/handlers/auth'

export default defineAuthedEventHandler(async (event) => {
  const user = event.context.authData.user

  const userSkins = await db.query.skins.findMany({
    where: eq(skins.userId, user.id),
  })

  return userSkins
})
