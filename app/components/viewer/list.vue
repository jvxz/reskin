<script lang="ts" setup>
const { getSkins } = useSkins()
const { data: session } = await authClient.useSession(useFetch)

const skins = await getSkins(!!session.value?.user)
const listInput = computed(() => skins.value ?? [])

const { containerProps, list, wrapperProps } = useVirtualList(
  listInput,
  {
    itemHeight: 84,
    overscan: 3,
  },
)
</script>

<template>
  <div class="m-2 flex w-1/4 flex-col gap-4">
    <ViewerListHeader />
    <div
      id="list"
      v-bind="containerProps"
      class="h-full space-y-2"
    >
      <div v-bind="wrapperProps">
        <ViewerListCard
          v-for="skin in list"
          :key="skin.index"
          :skin="skin.data"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
#list {
  /* scrollbar-width: thin; */
  scrollbar-color: var(--color-border) var(--color-background);
  scrollbar-gutter: stable;
}
</style>
