<script lang="ts" setup>
const { getSkins } = useSkins()
const { data: session } = await authClient.useSession(useFetch)

const skins = await getSkins(!!session.value?.user)
// const { sorted } = useSorted(skins.value ?? [], (a, b) => a.)
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
