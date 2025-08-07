import type { SkinViewer } from 'skinview3d'
import { DirectionalLight } from 'three'

export function loadViewerSettings(viewer: SkinViewer) {
  viewer.controls.enableZoom = false

  // all of these three.js properties (except for the camera position)
  // were taken from the namemc skin viewerœ

  // clear default camera light
  viewer.cameraLight.clear()

  // set global light
  viewer.globalLight.color.set(0xFFFFFF)
  viewer.globalLight.intensity = 2.3

  // set directional light
  const dirLight = new DirectionalLight(0xFFFFFF, 1)
  dirLight.position.set(0.678, 0.284, 0.678)
  // @ts-expect-error - this works fine
  viewer.scene.add(dirLight)

  // set camera properties
  viewer.fov = 38
  viewer.camera.near = 60 - 20
  viewer.camera.far = 60 + 20
  // default camera position
  viewer.camera.position.set(-25, 20, 48)
}
