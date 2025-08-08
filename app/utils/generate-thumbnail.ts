import { Buffer } from 'node:buffer'
import { SkinViewer } from 'skinview3d'
import { WalkAnimation } from '~/lib/walk-animation'
import { loadViewerSettings } from './load-canvas-settings'

const WIDTH = 89.6 * 6
const HEIGHT = 160 * 6

export async function generateThumbnail(
  skin: LocalSkin,
) {
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)

  canvas.style.display = 'none'

  canvas.width = WIDTH
  canvas.height = HEIGHT

  const viewer = new SkinViewer({
    animation: new WalkAnimation(false),
    canvas,
    height: HEIGHT,
    width: WIDTH,
  })

  loadViewerSettings(viewer)

  await viewer.loadSkin(`data:image/png;base64,${skin.base64}`)

  viewer.render()

  const blob = await new Promise<Blob>((resolve, reject) => {
    requestAnimationFrame(() => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        }
        else {
          reject(new Error('Failed to generate thumbnail'))
        }
      })
    })
  })

  const buffer = await blob.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')

  return base64
}
