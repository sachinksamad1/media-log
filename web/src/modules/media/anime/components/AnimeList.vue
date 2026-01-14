<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AnimeService } from '@/modules/media/anime/api/anime.service'
import type { Anime } from '@/modules/media/anime/types/types'
import AnimeDetailModal from '@/modules/media/anime/components/AnimeDetailModal.vue'
import AddNewAnimeModal from '@/modules/media/anime/components/AddNewAnimeModal.vue'

// ----------------------------------------------------
// STATE
// ----------------------------------------------------
const library = ref<Anime[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const nextCursor = ref<string | null>(null)
const hasMore = ref(true)
const selectedFilter = ref('All')

// Modal State
const selectedAnime = ref<Anime | null>(null)
const isModalOpen = ref(false)
const isAddModalOpen = ref(false)

// Config
const LIMIT = 24

// ----------------------------------------------------
// ACTIONS
// ----------------------------------------------------
function setFilter(filter: string) {
  if (selectedFilter.value === filter) return
  selectedFilter.value = filter
  // Reset pagination
  nextCursor.value = null
  hasMore.value = true
  fetchAnime()
}

function openDetails(anime: Anime) {
  selectedAnime.value = anime
  isModalOpen.value = true
}

function handleUpdate(updated: Anime) {
  // Update the item in the local list
  const index = library.value.findIndex(a => a.id === updated.id)
  if (index !== -1) {
    library.value[index] = updated
  }
  selectedAnime.value = updated
}

function handleCreate(newAnime: Anime) {
  library.value.unshift(newAnime)
  isAddModalOpen.value = false
}

function handleDelete(deletedId: string) {
  library.value = library.value.filter(a => a.id !== deletedId)
  isModalOpen.value = false
  selectedAnime.value = null
}

// ----------------------------------------------------
// FETCH
// ----------------------------------------------------
async function fetchAnime(isLoadMore = false) {
  if (loading.value || (!hasMore.value && isLoadMore)) return

  try {
    loading.value = true
    const cursor = isLoadMore ? nextCursor.value || undefined : undefined
    
    // Pass selectedFilter. If 'All', api service might send it, but backend should handle 'All' or empty
    const response = await AnimeService.getAll(LIMIT, cursor, selectedFilter.value)
    
    if (isLoadMore) {
      library.value.push(...response.data)
    } else {
      library.value = response.data
    }

    // Update Pagination State
    nextCursor.value = response.meta?.nextCursor || null
    hasMore.value = !!nextCursor.value

  } catch (err) {
    error.value = 'Failed to load library'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Initial Load
onMounted(() => {
  fetchAnime()
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground w-full">
    <div class="mx-auto w-full max-w-7xl px-2 lg:px-4 py-2">

      <!-- HEADER / FILTERS -->
      <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div class="flex items-center gap-4">
          <h3 class="text-xl font-semibold">My Library</h3>
          <button 
            @click="isAddModalOpen = true"
            class="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            <span>+</span> Add Anime
          </button>
        </div>
        
        <div class="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg">
          <button 
            v-for="filter in ['All', 'Completed', 'Planned', 'Ongoing']" 
            :key="filter"
            @click="setFilter(filter)"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            :class="selectedFilter === filter ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <!-- ERROR STATE -->
      <div v-if="error" class="text-destructive text-center py-8">
        {{ error }}
        <button 
          @click="fetchAnime()" 
          class="block mx-auto mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          Retry
        </button>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="!loading && library.length === 0" class="text-center py-12 text-muted">
        No anime found in your library.
      </div>

      <!-- GRID -->
      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
        <div
          v-for="anime in library"
          :key="anime.id"
          @click="openDetails(anime)"
          class="group bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
          <!-- Image Container -->
          <div class="relative w-full h-[260px] overflow-hidden">
            <img 
              :src="anime.imageUrl" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <!-- Overlay Info -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
               <span class="text-white font-medium truncate">{{ anime.title }}</span>
               <span class="text-xs text-white/80">Click to view details</span>
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold shadow-sm"
              :class="{
                'bg-green-500 text-white': anime.userStats.status === 'Completed',
                'bg-blue-500 text-white': anime.userStats.status === 'Planned',
                'bg-amber-500 text-white': anime.userStats.status === 'Ongoing',
                'bg-gray-500 text-white': !['Completed', 'Planned', 'Ongoing'].includes(anime.userStats.status)
              }"
            >
              {{ anime.userStats.status }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <h4 class="font-semibold text-base line-clamp-1 mb-1" :title="anime.title">{{ anime.title }}</h4>
            <div class="flex items-center justify-between text-sm text-muted-foreground">
              <span>{{ anime.releaseStats?.totalSeasons || 0 }} Season{{ (anime.releaseStats?.totalSeasons || 0) !== 1 ? 's' : '' }}</span>
              <div class="flex items-center gap-1 text-accent">
                <span>⭐</span>
                <span>{{ anime.userStats.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LOAD MORE -->
      <div v-if="hasMore" class="mt-12 flex justify-center">
        <button
          @click="fetchAnime(true)"
          :disabled="loading"
          class="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-medium shadow-sm hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>

    </div>

    <AnimeDetailModal 
      :anime="selectedAnime"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @update="handleUpdate"
      @delete="handleDelete"
    />

    <AddNewAnimeModal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
      @created="handleCreate"
    />
  </div>
</template>

<style scoped>
/* Add any view-specific extra styles here */
</style>