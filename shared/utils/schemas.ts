import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { skins } from '~~/server/db/schema'

export const UserSkinSchema = createInsertSchema(skins).extend({
  skinType: z.enum(['SLIM', 'CLASSIC']),
  source: z.enum(['USERNAME', 'UUID', 'URL', 'NAME_MC', 'FILE_UPLOAD']),
}).omit({
  createdAt: true,
})
export type UserSkin = z.infer<typeof UserSkinSchema>

export const LocalSkinSchema = UserSkinSchema.omit({
  skinUrl: true,
  thumbnailUrl: true,
  userId: true,
})
export type LocalSkin = z.infer<typeof LocalSkinSchema>
