<script lang="ts" setup>
const { signIn, signOut } = authClient

const { data: session } = await authClient.useSession(useFetch)
</script>

<template>
  <div class="flex flex-1 flex-col gap-4">
    <UButton
      size="icon"
      variant="ghost"
      class="group size-16"
    >
      <Icon name="tabler:box-model" class="!size-9 text-muted-foreground group-hover:text-foreground" />
    </UButton>
    <UButton
      v-if="!session?.user"
      size="icon"
      variant="ghost"
      class="group size-16"
      @click="signIn.social({
        provider: 'github',
      })"
    >
      <Icon name="tabler:login-2" class="!size-9 text-muted-foreground group-hover:text-foreground" />
    </UButton>
    <UButton
      v-else-if="session?.user"
      size="icon"
      variant="ghost"
      class="group size-16"
      @click="signOut({
        fetchOptions: {
          onResponse: () => reloadNuxtApp(),
        },
      })"
    >
      <Icon name="tabler:logout" class="!size-9 text-muted-foreground group-hover:text-foreground" />
    </UButton>
    <UButton
      v-else
      size="icon"
      variant="ghost"
      class="group size-16"
      disabled
    >
      <USpinner />
    </UButton>
  </div>
</template>
