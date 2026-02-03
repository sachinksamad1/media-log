<script setup lang="ts">
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'
import type { MediaItem } from '@/common/types/media'
import LazyImage from './LazyImage.vue'

const props = defineProps<{
  item: MediaItem
}>()

// Computed
const hasRating = computed(() => typeof props.item.rating === 'number' && props.item.rating > 0)
</script>

<template>
  <div class="relative group cursor-pointer transition-transform hover:-translate-y-1">
    <!-- Image Container with Aspect Ratio -->
    <div
      class="relative aspect-[2/3] rounded-xl overflow-hidden shadow-sm hover:shadow-md bg-secondary/20"
    >
      <LazyImage
        :src="item.coverUrl"
        :alt="item.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Overlay Gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"
      ></div>

      <!-- Rating Badge -->
      <div
        v-if="hasRating"
        class="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-yellow-400 text-xs font-bold shadow-sm"
      >
        <Star class="w-3 h-3 fill-current" />
        <span>{{ item.rating }}</span>
      </div>

      <!-- Content (Bottom) -->
      <div class="absolute bottom-0 left-0 right-0 p-3 text-white">
        <h4 class="font-semibold text-sm leading-tight line-clamp-2 mb-1" :title="item.title">
          {{ item.title }}
        </h4>

        <div class="flex items-center justify-between text-xs text-white/70">
          <span class="capitalize">{{ item.type }}</span>
          <span v-if="item.year">{{ item.year }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
