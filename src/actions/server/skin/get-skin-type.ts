'use server'
import sharp from 'sharp'

export async function getSkinType(base64: string): Promise<'SLIM' | 'CLASSIC'> {
  const image = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ''),
    'base64',
  )

  const { data, info } = await sharp(image).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  })

  if (info.width / info.height !== 1 && info.width / info.height !== 2) {
    throw new Error('Invalid skin: must be 1:1 or 1:2')
  }

  const rate = info.width / 64

  const armPixelX = 19 * rate
  const armPixelY = 50 * rate

  const { width } = info
  const armIndex = (armPixelX * width + armPixelY) * 4

  return data[armIndex] === 0 ? 'SLIM' : 'CLASSIC'
}
