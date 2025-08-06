import { defineAuthedEventHandler } from '~~/server/handlers/auth'

export default defineAuthedEventHandler(async ({ context }) => {
  return context.authData.user.id
})
