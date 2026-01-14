<script setup lang="ts">
import { ToastRoot, type ToastRootEmits, useForwardPropsEmits, type ToastRootProps } from 'radix-vue'
import { type ToastVariant } from '.'
import { toastVariants } from './constants'
import { cn } from '@/common/utils/tailwind-merge'
import { computed } from 'vue'

interface ToastProps extends ToastRootProps {
  class?: any
  variant?: ToastVariant
}

const props = defineProps<ToastProps>()

const emits = defineEmits<ToastRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ToastRoot
    v-bind="forwarded"
    :class="cn(toastVariants({ variant }), props.class)"
  >
    <slot />
  </ToastRoot>
</template>
