<script setup lang="ts">
import { computed } from 'vue'
import type { TvSeries } from '@modules/media/tvSeries/types/types'

const props = defineProps<{
  tvSeries: TvSeries
}>()

const statusClass = computed(() => {
  const status = props.tvSeries.userStats.status
  switch (status) {
    case 'Completed':
      return 'bg-green-500 text-white'
    case 'Plan to Watch':
      return 'bg-blue-500 text-white'
    case 'Watching':
      return 'bg-amber-500 text-white'
    case 'Dropped':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
})

const seasonsText = computed(() => {
  const total = props.tvSeries.tvSeriesStats.totalSeasons
  return `${total} Season${total !== 1 ? 's' : ''}`
})
</script>

<template>
  <div
    class="group bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
  >
    <!-- Image Container -->
    <div class="relative w-full h-[260px] overflow-hidden">
      <img
        :src="tvSeries.imageUrl"
        :alt="tvSeries.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <!-- Overlay Info -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
      >
        <span class="text-white font-medium truncate">{{ tvSeries.title }}</span>
        <span class="text-xs text-white/80">Click to view details</span>
      </div>

      <!-- Status Badge -->
      <div
        class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold shadow-sm"
        :class="statusClass"
      >
        {{ tvSeries.userStats.status }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h4 class="font-semibold text-base line-clamp-1 mb-1" :title="tvSeries.title">
        {{ tvSeries.title }}
      </h4>
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <span>{{ seasonsText }}</span>
        <div class="flex items-center gap-1 text-accent">
          <span>⭐</span>
          <span>{{ tvSeries.userStats.score }}</span>
        </div>
      </div>
      <div class="mt-1 text-xs text-muted-foreground line-clamp-1">
        {{ tvSeries.network || tvSeries.studio }}
      </div>
    </div>
  </div>
</template>
