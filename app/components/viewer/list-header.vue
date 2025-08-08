<script lang="ts" setup>
import { z } from 'zod/mini'

const { addSkin } = useSkins()

const textInput = ref('')
const { files, onChange, open: openFileDialog } = useFileDialog({
  accept: 'image/*',
  multiple: false,
})

onChange(async () => {
  if (files.value?.[0]) {
    if (files.value[0].type !== 'image/png') {
      useNuxtApp().$toast.error('Please select a PNG file')
      return
    }

    const imageFileBase64 = await getSkinBase64FromFile(files.value[0])

    addSkin({
      imageFileBase64,
    })
  }
})

function handleEnter() {
  if (textInput.value) {
    if (z.url({ protocol: /^https?$/ }).safeParse(textInput.value).success)
      return addSkin({ url: textInput.value })

    if (z.uuid().safeParse(textInput.value).success)
      return addSkin({ uuid: textInput.value })

    return addSkin({ username: textInput.value })
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="relative flex w-full">
      <UInput
        v-model="textInput"
        class="peer pe-9"
        placeholder="Username, UUID, URL or NameMC"
        @keyup.enter="handleEnter"
      />
      <UButton
        variant="ghost"
        size="icon"
        class="!absolute end-1.25 top-1/2 flex !size-6 -translate-y-1/2 items-center justify-center text-muted-foreground/80 peer-disabled:opacity-50"
      >
        <Icon name="tabler:arrow-right" />
      </UButton>
    </div>
    <UButton
      is="input"
      variant="soft"
      size="icon"
      @click="openFileDialog"
    >
      <Icon name="tabler:file-import" />
    </UButton>
  </div>
</template>
