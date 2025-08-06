<script lang="ts" setup>
const { data, error } = await useFetch('/api/user/post-skin')

function test() {
  authClient.signIn.social({
    provider: 'github',
  })
}
</script>

<template>
  <div class="mx-auto flex h-screen w-lg items-center justify-center">
    {{ data }}
    {{ error }}
    <UButton @click="test">
      Test
    </UButton>
  </div>
</template>
