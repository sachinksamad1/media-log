<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MediaItem, MediaStatus } from '@/common/types/media'

const props = defineProps<{
  items: MediaItem[]
  statusOrder: MediaStatus[]
}>()

type ViewMode = 'grid' | 'carousel'
const viewMode = ref<ViewMode>('grid')

const VISIBLE = 6
const carouselIndex = ref<Record<string, number>>({})

const grouped = computed(() => {
  const groups: Record<string, MediaItem[]> = {}

  props.statusOrder.forEach((s) => (groups[s] = []))

  props.items.forEach((item) => {
    groups[item.status]?.push(item)
  })

  return groups
})

const nonEmptyStatuses = computed(() => {
  return props.statusOrder.filter((status) => (grouped.value[status]?.length || 0) > 0)
})

function next(status: string) {
  const total = grouped.value[status]?.length || 0
  const max = Math.max(0, total - VISIBLE)
  carouselIndex.value[status] = Math.min((carouselIndex.value[status] || 0) + VISIBLE, max)
}

function prev(status: string) {
  carouselIndex.value[status] = Math.max((carouselIndex.value[status] || 0) - VISIBLE, 0)
}
</script>

<template>
  <div>
    <div class="flex justify-end mb-6 gap-2">
      <button
        class="view-btn"
        :class="{ 'view-btn-active': viewMode === 'grid' }"
        @click="viewMode = 'grid'"
      >
        Grid
      </button>

      <button
        class="view-btn"
        :class="{ 'view-btn-active': viewMode === 'carousel' }"
        @click="viewMode = 'carousel'"
      >
        Carousel
      </button>
    </div>

    <section v-for="status in nonEmptyStatuses" :key="status" class="mb-14">
      <h3 class="text-xl font-semibold mb-4 capitalize">
        {{ status }} ({{ grouped[status]?.length ?? 0 }})
      </h3>

      <!-- GRID -->
      <div
        v-if="viewMode === 'grid'"
        class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6"
      >
        <slot v-for="item in grouped[status] ?? []" name="card" :item="item" />
      </div>

      <!-- CAROUSEL -->
      <div v-else class="relative group">
        <button
          v-if="(grouped[status]?.length || 0) > VISIBLE"
          class="carousel-btn left opacity-0 group-hover:opacity-100 transition-opacity"
          :disabled="!carouselIndex[status]"
          @click="prev(status)"
        >
          ‹
        </button>

        <div class="overflow-hidden mx-4">
          <div
            class="flex gap-6 transition-transform duration-500"
            :style="{ transform: `translateX(-${(carouselIndex[status] || 0) * 200}px)` }"
          >
            <!-- Fixed width container for carousel items to maintain consistent spacing -->
            <div
              v-for="item in grouped[status] ?? []"
              :key="item.id"
              class="min-w-[180px] w-[180px]"
            >
              <slot name="card" :item="item" />
            </div>
          </div>
        </div>

        <button
          v-if="(grouped[status]?.length || 0) > VISIBLE"
          class="carousel-btn right opacity-0 group-hover:opacity-100 transition-opacity"
          @click="next(status)"
        >
          ›
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.view-btn {
  @apply px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-secondary/50 hover:bg-secondary text-muted-foreground;
}

.view-btn-active {
  @apply bg-primary text-primary-foreground;
}

.carousel-btn {
  @apply absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm disabled:opacity-0 cursor-pointer;
}

.carousel-btn.left {
  @apply -left-4;
}

.carousel-btn.right {
  @apply -right-4;
}
</style>
