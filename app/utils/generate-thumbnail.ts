import { Buffer } from 'node:buffer'
import { SkinViewer } from 'skinview3d'
import { WalkAnimation } from '~/lib/walk-animation'
import { loadViewerSettings } from './load-canvas-settings'

const WIDTH = 89.6 * 6
const HEIGHT = 160 * 6

export function generateThumbnail(
  skin: LocalSkin
): Promise<string>

export function generateThumbnail(
  skin: LocalSkin,
  options?: { returnType?: 'base64' }
): Promise<string>

export function generateThumbnail(
  skin: LocalSkin,
  options: { returnType: 'arraybuffer' }
): Promise<ArrayBuffer>

export async function generateThumbnail(skin: LocalSkin, { returnType = 'base64' }: { returnType?: 'base64' | 'arraybuffer' } = {}) {
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.id = 'thumbnail-canvas'

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

  if (returnType === 'arraybuffer') {
    return cleanup(async () => await blob.arrayBuffer())
  }

  return cleanup(async () => Buffer.from(await blob.arrayBuffer()).toString('base64'))
}

function cleanup<T>(callback: () => Promise<T>) {
  const canvas = document.querySelector('#thumbnail-canvas')
  if (canvas) {
    canvas.remove()
  }

  return callback()
}
