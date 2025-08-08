<script lang="ts" setup>
import { Slot } from 'reka-ui'

interface ButtonProps {
  asChild?: boolean
  disabled?: boolean
  size?: 'default' | 'icon' | 'lg' | 'sm'
  variant?: 'default' | 'destructive' | 'ghost' | 'link' | 'outline' | 'soft'
  class?: string
}

const props = withDefaults(
  defineProps<ButtonProps>(),
  {
    asChild: false,
    class: '',
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
    :class="buttonVariants({ variant, size, class: props.class })"
  >
    <slot />
  </Slot>
  <button
    v-else
    :disabled="disabled"
    :class="buttonVariants({ variant, size, class: props.class })"
  >
    <slot />
  </button>
</template>
