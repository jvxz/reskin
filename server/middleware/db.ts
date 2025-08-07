import { db as dbInstance } from '../db'

export default defineEventHandler(async (event) => {
  const db = event.context.db ?? dbInstance
  event.context.db = db
})
