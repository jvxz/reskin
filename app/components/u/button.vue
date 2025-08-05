<script lang="ts" setup>
import { Slot } from 'reka-ui'

interface ButtonProps {
  asChild?: boolean
  disabled?: boolean
  size?: 'default' | 'icon' | 'lg' | 'sm'
  variant?: 'default' | 'destructive' | 'ghost' | 'link' | 'outline'
}

withDefaults(
  defineProps<ButtonProps>(),
  {
    asChild: false,
    disabled: false,
    size: 'default',
    variant: 'default',
  },
)
</script>

<template>
  <Slot
    v-if="asChild"
    :disabled="disabled"
    :class="buttonVariants({ variant, size })"
  >
    <slot />
  </Slot>
  <button
    v-else
    :disabled="disabled"
    :class="buttonVariants({ variant, size })"
  >
    <slot />
  </button>
</template>
