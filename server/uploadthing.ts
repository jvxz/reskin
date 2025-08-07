import type { FileRouter } from 'uploadthing/h3'
import { createUploadthing } from 'uploadthing/h3'
import { auth } from './auth'

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
  })
    .middleware(async ({ event }) => {
      const authData = await auth.api.getSession(event)

      if (!authData) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized',
        })
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: authData.user.id }
    })
    .onUploadComplete(async () => {}),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
