<script lang="ts" setup>
import { PiniaColadaDevtools } from "@pinia/colada-devtools";

type Theme = "light" | "dark" | "system";
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <PiniaColadaDevtools />
  <Toaster
    :toast-options="{
      classes: {
        actionButton: '!bg-primary !text-primary-foreground font-medium',
        cancelButton: '!bg-muted !text-muted-foreground font-medium',
        description: '!text-muted-foreground',
        toast:
          'group toast !bg-card !text-card-foreground !border-border !shadow-none',
      },
    }"
    :theme="$colorMode.value as Theme"
    position="top-right"
  />
</template>
