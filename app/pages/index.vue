<template>
  <div class="mx-auto flex h-screen w-lg items-center justify-center">
    <UButton @click="$toast.error('test')">
      Toast
    </UButton>
  </div>
</template>
