<script lang="ts" setup>
defineProps<{
  skin: UserSkin | LocalSkin
}>()

const { copy } = useClipboard()
const { currentSkin } = useCurrentSkin()
const { deleteSkin } = useSkins()
</script>

<template>
  <UContextMenu>
    <UContextMenuTrigger as-child>
      <UCard
        :class="cn(
          buttonVariants({ variant: 'soft' }),
          staticStyles.variant.default,
          'flex h-18 animate-in flex-row items-center justify-start gap-4 p-4 transition duration-150 fade-in-0 zoom-in-95',
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
    </UContextMenuTrigger>
    <UContextMenuContent>
      <UContextMenuItem>
        <Icon name="tabler:box-model" />
        Apply
      </UContextMenuItem>
      <UContextMenuItem @click="deleteSkin(skin.id)">
        <Icon name="tabler:trash" />
        Delete
      </UContextMenuItem>
      <UContextMenuItem v-if="skin.originalName" as-child>
        <NuxtLink target="_blank" :href="`https://namemc.com/${skin.originalName}`">
          <Icon name="tabler:external-link" />
          View on NameMC
        </NuxtLink>
      </UContextMenuItem>
      <UContextMenuSeparator />
      <UContextMenuItem v-if="skin.skinUrl" @click="copy(skin.skinUrl)">
        <Icon name="tabler:link" />
        Copy URL
      </UContextMenuItem>
    </UContextMenuContent>
  </UContextMenu>
</template>
