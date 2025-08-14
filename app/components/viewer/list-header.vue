<script lang="ts" setup>
import { z } from 'zod/mini'

const { data: session } = await authClient.useSession(useFetch)
const { addSkin, isAddingSkin } = useSkins()

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
      input: {
        imageFileBase64,
      },
      isAuthed: !!session.value?.user,
    })
  }
})

function handleEnter() {
  if (isAddingSkin.value) {
    return
  }

  if (textInput.value) {
    if (z.url({ protocol: /^https?$/ }).safeParse(textInput.value).success)
      return addSkin({ input: { url: textInput.value }, isAuthed: !!session.value?.user })

    if (z.uuid().safeParse(textInput.value).success)
      return addSkin({ input: { uuid: textInput.value }, isAuthed: !!session.value?.user })

    return addSkin({ input: { username: textInput.value }, isAuthed: !!session.value?.user })
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
        :disabled="isAddingSkin"
        variant="ghost"
        size="icon"
        class="!absolute end-1.25 top-1/2 flex !size-6 -translate-y-1/2 items-center justify-center text-muted-foreground/80 peer-disabled:opacity-50"
        @click="handleEnter"
      >
        <Icon name="tabler:arrow-right" />
      </UButton>
    </div>
    <UButton
      is="input"
      :disabled="isAddingSkin"
      variant="soft"
      size="icon"
      @click="openFileDialog"
    >
      <Icon name="tabler:file-import" />
    </UButton>
  </div>
</template>
