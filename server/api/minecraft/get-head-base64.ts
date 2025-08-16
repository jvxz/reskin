import { Buffer } from 'node:buffer'
import { Image } from 'imagescript'
import z from 'zod'

const HEAD_XY = [8, 8] as const
const HELMET_XY = [40, 8] as const

const BodySchema = z.object({
  base64: z.base64(),
})

export default defineEventHandler(async (event) => {
  const { base64 } = await readValidatedBody(event, BodySchema.parse)

  const imageBuffer = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ''),
    'base64',
  )

  // Load the image with imagescript
  const image = await Image.decode(imageBuffer)

  // Validate skin proportions
  if (image.width / image.height !== 1 && image.width / image.height !== 2) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid skin: must be 1:1 or 1:2',
    })
  }

  // Extract head (8x8 pixels starting at 8,8)
  const head = image.crop(HEAD_XY[0], HEAD_XY[1], 8, 8)

  // Extract helmet/hat (8x8 pixels starting at 40,8)
  const helmet = image.crop(HELMET_XY[0], HELMET_XY[1], 8, 8)

  // Create a new 8x8 image for the result
  const result = new Image(8, 8)

  // Copy head pixels
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const headPixel = head.getPixelAt(x, y)
      result.setPixelAt(x, y, headPixel)
    }
  }

  // Composite helmet on top (only if pixel is not transparent)
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const helmetPixel = helmet.getPixelAt(x, y)
      const alpha = (helmetPixel >>> 24) & 0xFF

      // Only composite if helmet pixel is not transparent
      if (alpha > 0) {
        result.setPixelAt(x, y, helmetPixel)
      }
    }
  }

  // Encode as PNG and return as base64
  const encodedBuffer = await result.encode()
  return Buffer.from(encodedBuffer).toString('base64')
})
