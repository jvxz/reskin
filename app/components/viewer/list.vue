<script lang="ts" setup>
const { skins } = useSkins()
</script>

<template>
  <div class="m-3 w-1/4 space-y-3">
    <ViewerListHeader />
    <ViewerListCard
      v-for="skin in skins"
      :key="skin.id"
      :skin="skin"
    />
  </div>
</template>
