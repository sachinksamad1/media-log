<script setup lang="ts">
import { computed } from 'vue'
import type { Anime } from '@/modules/media/anime/types/types'

const props = defineProps<{
  anime: Anime
}>()

const statusClass = computed(() => {
  const status = props.anime.userStats.status
  switch (status) {
    case 'Completed':
      return 'bg-green-500 text-white'
    case 'Planned':
      return 'bg-blue-500 text-white'
    case 'Ongoing':
      return 'bg-amber-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
})

const seasonsText = computed(() => {
  const count = props.anime.releaseStats?.totalSeasons || 0
  return `${count} Season${count !== 1 ? 's' : ''}`
})
</script>

<template>
  <div
    class="group bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
  >
    <!-- Image Container -->
    <div class="relative w-full h-[260px] overflow-hidden">
      <img
        :src="anime.imageUrl"
        :alt="anime.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <!-- Overlay Info -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
      >
        <span class="text-white font-medium truncate">{{ anime.title }}</span>
        <span class="text-xs text-white/80">Click to view details</span>
      </div>

      <!-- Status Badge -->
      <div
        class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold shadow-sm"
        :class="statusClass"
      >
        {{ anime.userStats.status }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h4 class="font-semibold text-base line-clamp-1 mb-1" :title="anime.title">
        {{ anime.title }}
      </h4>
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <span>{{ seasonsText }}</span>
        <div class="flex items-center gap-1 text-accent">
          <span>⭐</span>
          <span>{{ anime.userStats.score }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
