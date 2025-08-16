import z from 'zod'
import { skins } from '~~/server/db/schema'

export default defineAuthedEventHandler(async (event) => {
  const { thumbnailBase64, ...skinData } = await readValidatedBody(event, LocalSkinSchema.extend({
    thumbnailBase64: z.string(),
  }).parse)

  const [thumbnailFile, skinFile] = await Promise.all([
    getFileFromB64(thumbnailBase64, `thumbnail_${skinData.id}.png`, 'image/png'),
    getFileFromB64(skinData.base64, `skin_${skinData.id}.png`, 'image/png'),
  ])

  const [thumbnailUrl, skinUrl] = await event.context.ut.uploadFiles([thumbnailFile, skinFile])

  if (thumbnailUrl.error || skinUrl.error) {
    throw createError({
      statusCode: 500,
      statusMessage: thumbnailUrl.error?.message ?? skinUrl.error?.message ?? 'An unknown error occurred when uploading your skin',
    })
  }

  const skin: UserSkin = {
    ...skinData,
    skinUrl: skinUrl.data?.ufsUrl,
    thumbnailUrl: thumbnailUrl.data?.ufsUrl,
    userId: event.context.authData.user.id,
  }

  await useDrizzle().insert(skins).values(skin)

  return skin
})
