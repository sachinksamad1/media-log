<script setup lang="ts">
import { Star, Image as ImageIcon } from 'lucide-vue-next'
import type { ReportItem } from '../types/types'

interface Props {
  items: ReportItem[]
  formatDate: (date: string) => string
}

defineProps<Props>()

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    Watching: 'bg-emerald-500/20 text-emerald-500',
    Reading: 'bg-emerald-500/20 text-emerald-500',
    Playing: 'bg-emerald-500/20 text-emerald-500',
    Planned: 'bg-blue-500/20 text-blue-500',
    Completed: 'bg-violet-500/20 text-violet-500',
    Dropped: 'bg-red-500/20 text-red-500',
    'On-Hold': 'bg-amber-500/20 text-amber-500',
  }
  return colors[status] || 'bg-muted text-muted-foreground'
}

const getMediaTypeColor = (mediaType: string): string => {
  const colors: Record<string, string> = {
    anime: 'bg-pink-500/20 text-pink-500',
    manga: 'bg-orange-500/20 text-orange-500',
    fiction: 'bg-green-500/20 text-green-500',
    lightNovel: 'bg-violet-500/20 text-violet-500',
    nonFiction: 'bg-blue-500/20 text-blue-500',
    movie: 'bg-red-500/20 text-red-500',
    tvSeries: 'bg-yellow-500/20 text-yellow-500',
    game: 'bg-teal-500/20 text-teal-500',
  }
  return colors[mediaType] || 'bg-muted text-muted-foreground'
}

const getMediaTypeLabel = (mediaType: string): string => {
  const labels: Record<string, string> = {
    anime: 'Anime',
    manga: 'Manga',
    fiction: 'Fiction',
    lightNovel: 'Light Novel',
    nonFiction: 'Non-Fiction',
    movie: 'Movie',
    tvSeries: 'TV Series',
    game: 'Game',
  }
  return labels[mediaType] || mediaType
}
</script>

<template>
  <div class="rounded-xl border border-border bg-card overflow-hidden">
    <!-- Empty State -->
    <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-16">
      <div class="p-4 rounded-full bg-muted/50 mb-4">
        <ImageIcon class="w-8 h-8 text-muted-foreground" />
      </div>
      <p class="text-lg font-medium text-muted-foreground">No items found</p>
      <p class="text-sm text-muted-foreground/60">Try adjusting your filters</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border bg-muted/30">
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Title
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Type
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Status
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Score
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Genres
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Added
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr
            v-for="item in items"
            :key="item.id"
            class="hover:bg-muted/20 transition-colors group"
          >
            <!-- Title with Image -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border"
                >
                  <img
                    v-if="item.imageUrl"
                    :src="item.imageUrl"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <ImageIcon class="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="font-medium truncate max-w-[200px] sm:max-w-[300px]">
                    {{ item.title }}
                  </p>
                </div>
              </div>
            </td>

            <!-- Media Type -->
            <td class="px-4 py-3">
              <span
                class="inline-flex px-2 py-1 rounded-md text-xs font-medium"
                :class="getMediaTypeColor(item.mediaType)"
              >
                {{ getMediaTypeLabel(item.mediaType) }}
              </span>
            </td>

            <!-- Status -->
            <td class="px-4 py-3">
              <span
                class="inline-flex px-2 py-1 rounded-md text-xs font-medium"
                :class="getStatusColor(item.status)"
              >
                {{ item.status }}
              </span>
            </td>

            <!-- Score -->
            <td class="px-4 py-3">
              <div v-if="item.score > 0" class="flex items-center gap-1">
                <Star class="w-4 h-4 text-amber-500 fill-amber-500" />
                <span class="font-medium">{{ item.score }}</span>
              </div>
              <span v-else class="text-muted-foreground text-sm">—</span>
            </td>

            <!-- Genres -->
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1 max-w-[200px]">
                <span
                  v-for="genre in item.genres.slice(0, 2)"
                  :key="genre"
                  class="inline-flex px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                >
                  {{ genre }}
                </span>
                <span
                  v-if="item.genres.length > 2"
                  class="inline-flex px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                >
                  +{{ item.genres.length - 2 }}
                </span>
              </div>
            </td>

            <!-- Added Date -->
            <td class="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
              {{ formatDate(item.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
