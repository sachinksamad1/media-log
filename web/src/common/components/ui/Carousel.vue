<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineProps<{
  title?: string
}>()

const scrollContainer = ref<HTMLElement | null>(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(true)

const scroll = (direction: 'left' | 'right') => {
  if (!scrollContainer.value) return
  
  const container = scrollContainer.value
  const scrollAmount = container.clientWidth * 0.8
  const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
  
  container.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  })
}

const checkScroll = () => {
  if (!scrollContainer.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  showLeftArrow.value = scrollLeft > 0
  showRightArrow.value = Math.abs(scrollLeft + clientWidth - scrollWidth) > 1
}

onMounted(() => {
  const container = scrollContainer.value
  if (container) {
    container.addEventListener('scroll', checkScroll)
    // Create ResizeObserver to check scroll on window resize
    const resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(container)
    checkScroll() // Initial check
    
    // Cleanup
    onUnmounted(() => {
        container.removeEventListener('scroll', checkScroll)
        resizeObserver.disconnect()
    })
  }
})
</script>

<template>
  <div class="py-4 space-y-2 group/carousel relative">
    <div v-if="title" class="px-4 lg:px-0 mb-4">
      <h3 class="text-xl font-semibold text-[hsl(var(--category))]">{{ title }}</h3>
    </div>
    
    <div class="relative group">
      <!-- Left Arrow -->
      <button 
        v-show="showLeftArrow"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 -ml-4"
        aria-label="Scroll left"
        @click="scroll('left')"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>

      <!-- Scroll Container -->
      <div 
        ref="scrollContainer"
        class="flex gap-4 overflow-x-auto pb-4 px-4 lg:px-0 scrollbar-hide snap-x snap-mandatory"
        style="scrollbar-width: none; -ms-overflow-style: none;"
      >
        <slot />
      </div>

      <!-- Right Arrow -->
      <button 
        v-show="showRightArrow"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 -mr-4"
        aria-label="Scroll right"
        @click="scroll('right')"
      >
        <ChevronRight class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
