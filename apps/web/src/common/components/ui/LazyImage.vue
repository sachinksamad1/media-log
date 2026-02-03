<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  class?: string
}>()

const imageRef = ref<HTMLElement | null>(null)
const isLoaded = ref(false)
const error = ref(false)
const observer = ref<IntersectionObserver | null>(null)

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry && entry.isIntersecting) {
      const img = new Image()
      img.src = props.src
      img.onload = () => {
        isLoaded.value = true
      }
      img.onerror = () => {
        error.value = true
      }
      observer.value?.disconnect()
    }
  })

  if (imageRef.value) {
    observer.value.observe(imageRef.value)
  }
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<template>
  <div ref="imageRef" class="relative overflow-hidden bg-secondary/30" :class="props.class">
    <img
      v-if="isLoaded"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover transition-opacity duration-500"
      :class="[isLoaded ? 'opacity-100' : 'opacity-0']"
    />
    <div v-else class="absolute inset-0 flex items-center justify-center">
      <div v-if="error" class="text-sm text-red-500">Error</div>
      <div v-else class="w-full h-full animate-pulse bg-secondary/50"></div>
    </div>
  </div>
</template>
