import pLimit from 'p-limit'
import z from 'zod'
import * as schema from '~~/server/db/schema'

const limit = pLimit(4)

const BodySchema = LocalSkinSchema.extend({
  thumbnailBase64: z.string(),
}).array()

export default defineAuthedEventHandler(async (event) => {
  const skins = await validateZodBody(event, BodySchema)

  const procedures = skins.map(async (skin): Promise<UserSkin> => limit(async () => {
    const skinBlob = await $fetch<Blob>(`data:image/png;base64,${skin.thumbnailBase64}`, {
      responseType: 'blob',
    })

    const skinFile = new File([skinBlob], `skin-${skin.id}`, { type: 'image/png' })
    const skinUploadRes = await event.context.ut.uploadFiles([skinFile])
    if (skinUploadRes[0] && skinUploadRes[0].error) {
      throw createError({
        message: 'An error occurred while migrating your skins',
        statusCode: 500,
      })
    }

    const thumbnailBlob = await $fetch<Blob>(`data:image/png;base64,${skin.thumbnailBase64}`, {
      responseType: 'blob',
    })

    const thumbnailFile = new File([thumbnailBlob], `thumbnail-${skin.id}`, { type: 'image/png' })
    const thumbnailUploadRes = await event.context.ut.uploadFiles([thumbnailFile])
    if (thumbnailUploadRes[0] && thumbnailUploadRes[0].error) {
      throw createError({
        message: 'An error occurred while migrating your skins',
        statusCode: 500,
      })
    }

    return {
      ...skin,
      skinUrl: skinUploadRes[0].data.ufsUrl,
      thumbnailUrl: thumbnailUploadRes[0].data.ufsUrl,
      userId: event.context.authData.user.id,
    }
  }))

  const userSkins = await Promise.all(procedures)

  await event.context.db.insert(schema.skins).values(userSkins)
})
