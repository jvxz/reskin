<script lang="ts" setup>
const { skins } = useSkins()
</script>

<template>
  <div class="m-2 w-1/4 space-y-4">
    <ViewerListHeader />
    <div class="space-y-2">
      <ViewerListCard
        v-for="skin in skins"
        :key="skin.id"
        :skin="skin"
      />
    </div>
  </div>
</template>
