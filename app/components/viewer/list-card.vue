<script lang="ts" setup>
defineProps<{
  skin: UserSkin | LocalSkin
}>()

const { currentSkin } = useCurrentSkin()
</script>

<template>
  <UCard
    :class="cn(
      buttonVariants({ variant: 'soft' }),
      staticStyles.variant.default,
      'flex h-18 animate-in flex-row items-center justify-start gap-3 p-3 transition duration-150 fade-in-0 zoom-in-95',
    )"
    @click="currentSkin = skin"
  >
    <div class="flex items-center gap-2">
      <NuxtImg :src="`data:image/png;base64,${skin.headBase64}`" class="size-12 rounded [image-rendering:pixelated]" />
      <div class="flex !h-full flex-1 flex-col justify-between gap-1">
        <p class="text-sm font-medium">
          {{ skin.name }}
        </p>
        <p class="text-xs text-muted-foreground">
          {{ formatSkinType(skin.skinType) }}
        </p>
      </div>
    </div>
  </UCard>
</template>
