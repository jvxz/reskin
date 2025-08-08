<script lang="ts" setup>

</script>

<template>
  <main class="flex h-screen flex-row-reverse bg-card p-3">
    <UCard class="h-full w-[calc(100vw-var(--sidebar))]  overflow-y-auto rounded bg-background p-0">
      <slot />
    </UCard>
  </main>
</template>
