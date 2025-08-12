<script lang="ts" setup>
const { data: session } = await authClient.useSession(useFetch)
const { clearLocalSkins, localSkins } = useLocalSkins()
const { isMigratingSkins, migrateLocalSkins } = useSkins()

const shouldOpen = computed(() => session.value?.user && localSkins.value.length > 0)

function handleDeny() {
  clearLocalSkins()
  useNuxtApp().$toast.success('Your local skins were deleted')
}
</script>

<template>
  <UAlertDialogRoot :open="shouldOpen">
    <UAlertDialogContent>
      <UAlertDialogHeader>
        <UAlertDialogTitle>
          Local skin migration
        </UAlertDialogTitle>
        <UAlertDialogDescription>
          <p className="leading-relaxed">
            It seems like you have imported skins while you were not logged
            in. These skins will not sync across devices. Would you like to
            migrate them to your account?
          </p>
        </UAlertDialogDescription>
      </UAlertDialogHeader>
      <UAlertDialogFooter>
        <UAlertDialogCancel @click="handleDeny">
          Cancel
        </UAlertDialogCancel>
        <UAlertDialogAction as-child>
          <UButton :is-loading="isMigratingSkins" @click="migrateLocalSkins">
            Migrate
          </UButton>
        </UAlertDialogAction>
      </UAlertDialogFooter>
    </UAlertDialogContent>
  </UAlertDialogRoot>
</template>
