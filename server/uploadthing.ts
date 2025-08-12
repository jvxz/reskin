import type { FileRouter } from 'uploadthing/h3'
import { createUploadthing } from 'uploadthing/h3'

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
  })
    .middleware(async ({ event }) => {
      const authData = event.context.authData

      const userId = authData?.user.id

      if (!userId) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized',
        })
      }

      return { userId }
    })
    .onUploadComplete(async () => {}),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
