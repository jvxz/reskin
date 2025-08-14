<script lang="ts" setup>
const props = defineProps<{
  skin: UserSkin
}>()

const { isAuthed } = await useAuth()
const { copy } = useClipboard()
const { currentSkin } = useCurrentSkin()
const { deleteSkin } = useSkins()
const currentPendingSkin = useCurrentlyPending()

const isPending = computed(() => currentPendingSkin.value === props.skin.id)
</script>

<template>
  <UContextMenu>
    <UContextMenuTrigger as-child>
      <UCard
        :class="cn(
          buttonVariants({ variant: 'soft' }),
          staticStyles.variant.default,
          'flex h-18 animate-in flex-row items-center justify-start gap-4 p-4 transition duration-150 fade-in-0 zoom-in-95 first:mt-px mt-3',
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
      <UContextMenuItem :disabled="isPending" @click="currentSkin = skin">
        <Icon name="tabler:box-model" />
        Apply
      </UContextMenuItem>
      <UContextMenuItem :disabled="isPending" @click="deleteSkin({ isAuthed, skin })">
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
      <UContextMenuItem
        v-if="skin.skinUrl"
        :disabled="isPending"
        @click="copy(skin.skinUrl)"
      >
        <Icon name="tabler:link" />
        Copy URL
      </UContextMenuItem>
    </UContextMenuContent>
  </UContextMenu>
</template>
