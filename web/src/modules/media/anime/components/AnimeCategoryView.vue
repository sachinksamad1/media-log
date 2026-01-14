<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { AnimeService } from '../api/animeService'
import type { Anime } from '../types/types'

// ----------------------------------------------------
// STATE
// ----------------------------------------------------
const library = ref<Anime[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

type ViewMode = 'grid' | 'carousel'
const viewMode = ref<ViewMode>('grid')

// How many items visible in carousel
const VISIBLE = 6

// Scroll index per category
const carouselIndex = ref<Record<string, number>>({})

// ----------------------------------------------------
// CATEGORY CONFIG
// ----------------------------------------------------
const categoryOrder = ['Completed', 'Planned', 'Ongoing']

const categorizedLibrary = computed(() => {
  const groups: Record<string, Anime[]> = {}

  categoryOrder.forEach(c => (groups[c] = []))

  library.value.forEach(anime => {
    const status = anime.userStats.status
    if (groups[status]) {
      groups[status]!.push(anime)
    } else {
      if (!groups.Other) groups.Other = []
      groups.Other!.push(anime)
    }
  })

  return groups
})

// ----------------------------------------------------
// CAROUSEL CONTROLS
// ----------------------------------------------------
function next(category: string) {
  const total = categorizedLibrary.value[category]?.length || 0
  const max = Math.max(0, total - VISIBLE)

  carouselIndex.value[category] = Math.min(
    (carouselIndex.value[category] || 0) + VISIBLE,
    max
  )
}

function prev(category: string) {
  carouselIndex.value[category] = Math.max(
    (carouselIndex.value[category] || 0) - VISIBLE,
    0
  )
}

// ----------------------------------------------------
// FETCH
// ----------------------------------------------------
async function fetchAnime() {
  try {
    loading.value = true
    const response = await AnimeService.getAll()
    library.value = response.data
  } catch {
    error.value = 'Failed to load library'
  } finally {
    loading.value = false
  }
}

onMounted(fetchAnime)
</script>

<template>
  <div class="min-h-screen bg-background text-foreground w-full">
    <div class="mx-auto w-full max-w-7xl px-2 lg:px-4 py-2">

<div class="flex justify-end mb-8 gap-2">
  <button
    class="view-btn px-4 py-2 rounded-lg"
    :class="viewMode === 'grid' && 'view-btn-active'"
    @click="viewMode = 'grid'"
  >
    Grid
  </button>

  <button
    class="view-btn px-4 py-2 rounded-lg"
    :class="viewMode === 'carousel' && 'view-btn-active'"
    @click="viewMode = 'carousel'"
  >
    Carousel
  </button>
</div>

      <div v-if="loading" class="text-muted">Loading...</div>
      <div v-else-if="error" class="text-destructive">{{ error }}</div>

      <div v-else>
        <section v-for="category in categoryOrder" :key="category" class="mb-16">
          <div v-if="categorizedLibrary[category]?.length">
            <h3
              class="flex items-center gap-3 text-xl font-semibold pb-3 mb-6 border-b border-border"
              :class="{
                'text-status-completed': category === 'Completed',
                'text-status-planned': category === 'Planned',
                'text-status-ongoing': category === 'Ongoing'
              }"
            >
              {{ category }}
              <span class="text-sm text-muted">
                ({{ categorizedLibrary[category]?.length }})
              </span>
            </h3>

            <!-- GRID -->
            <div
              v-if="viewMode === 'grid'"
              class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6"
            >
              <div
                v-for="anime in categorizedLibrary[category]"
                :key="anime.id"
                class="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:-translate-y-2 transition"
              >
                <img :src="anime.imageUrl" class="w-full h-[200px] object-cover" />
                <div class="p-4">
                  <h4 class="font-semibold">{{ anime.title }}</h4>
                  <p class="text-sm text-accent">⭐ {{ anime.userStats.score }}</p>
                </div>
              </div>
            </div>

            <!-- CAROUSEL -->
            <div v-else class="relative">
              <button
                class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 px-3 py-2 text-white rounded-full"
                @click="prev(category)"
              >
                ‹
              </button>

              <div class="overflow-hidden">
                <div
                  class="flex transition-transform duration-500"
                  :style="{
                    transform: `translateX(-${(carouselIndex[category] || 0) * 200}px)`
                  }"
                >
                  <div
                    v-for="anime in categorizedLibrary[category]"
                    :key="anime.id"
                    class="min-w-[180px] mx-2 bg-card border border-border rounded-xl overflow-hidden"
                  >
                    <img :src="anime.imageUrl" class="w-full h-[200px] object-cover" />
                    <div class="p-3">
                      <h4 class="text-sm font-semibold">{{ anime.title }}</h4>
                    </div>
                  </div>
                </div>
              </div>

              <button
                class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 px-3 py-2 text-white rounded-full"
                @click="next(category)"
              >
                ›
              </button>
            </div>

          </div>
        </section>
      </div>

    </div>
  </div>
</template>