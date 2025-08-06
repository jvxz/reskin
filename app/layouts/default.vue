<script lang="ts" setup>
type Theme = 'light' | 'dark' | 'system'
</script>

<template>
  <div>
    <slot />
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
  </div>
</template>
