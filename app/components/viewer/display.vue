<script lang="ts" setup>
import type { SkinViewer } from 'skinview3d'
import * as skinview3d from 'skinview3d'
import { WalkAnimation } from '~/lib/walk-animation'

const canvasRef = ref<HTMLCanvasElement>()
const svRef = ref<SkinViewer>()
const { currentSkin } = useCurrentSkin()

watch(canvasRef, () => {
  if (!canvasRef.value)
    return

  if (!svRef.value) {
    svRef.value = new skinview3d.SkinViewer({
      animation: new WalkAnimation(true),
      canvas: canvasRef.value,
      fov: 38,
      height: 400,
      width: 300,
    })
  }

  const sv = svRef.value

  loadViewerSettings(sv)

  sv.height = 700
  sv.width = 500
})

watch(currentSkin, () => {
  if (!currentSkin.value || !svRef.value)
    return

  svRef.value.loadSkin(`data:image/png;base64,${currentSkin.value.base64}`)
})
</script>

<template>
  <div class="h-full w-3/4 flex items-center justify-center">
    <canvas ref="canvasRef" class="border" />
  </div>
</template>
