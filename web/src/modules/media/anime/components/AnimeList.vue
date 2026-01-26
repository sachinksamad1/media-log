<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { AnimeService } from '@/modules/media/anime/api/animeService'
import { useAuthStore } from '@/core/stores/useAuthStore'
import type { Anime } from '@/modules/media/anime/types/types'
import AnimeDetailModal from '@/modules/media/anime/components/AnimeDetailModal.vue'
import AddNewAnimeModal from '@/modules/media/anime/components/AddNewAnimeModal.vue'
import AnimeCard from '@modules/media/anime/components/AnimeCard.vue'
import Carousel from '@common/components/ui/Carousel.vue'
import { watchDebounced } from '@vueuse/core'
import { Search } from 'lucide-vue-next'

// ----------------------------------------------------
// STATE
// ----------------------------------------------------
const library = ref<Anime[]>([])
const watchingLibrary = ref<Anime[]>([])
const plannedLibrary = ref<Anime[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const nextCursor = ref<string | null>(null)
const hasMore = ref(true)
const selectedFilter = ref('All')
const searchQuery = ref('')
const isSearching = ref(false)

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
  // Reload the list to ensure data consistency
  fetchAnime()
  selectedAnime.value = updated
}

function handleCreate() {
  fetchAnime()
  fetchCarousels()
  isAddModalOpen.value = false
}

function handleDelete() {
  fetchAnime()
  fetchCarousels()
  isModalOpen.value = false
  selectedAnime.value = null
}

// ----------------------------------------------------
// FETCH CAROUSELS
// ----------------------------------------------------
async function fetchCarousels() {
  try {
    const [watching, planned] = await Promise.all([
      AnimeService.getAll(20, undefined, 'Watching'),
      AnimeService.getAll(20, undefined, 'Planned')
    ])
    watchingLibrary.value = watching.data
    plannedLibrary.value = planned.data
  } catch (err) {
    console.error('Failed to load carousels', err)
  }
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

// Search Logic
watchDebounced(
  searchQuery,
  async (q) => {
    if (!q || q.trim() === '') {
      if (isSearching.value) {
        isSearching.value = false
        // Reset to normal list
        nextCursor.value = null
        hasMore.value = true
        fetchAnime()
      }
      return
    }

    isSearching.value = true
    loading.value = true
    try {
      const results = await AnimeService.search(q)
      library.value = results
      hasMore.value = false // Search endpoint doesn't support cursor pagination yet
    } catch (err) {
      error.value = 'Failed to search'
      console.error(err)
    } finally {
      loading.value = false
    }
  },
  { debounce: 500 }
)

const authStore = useAuthStore()

// Initial Load
onMounted(() => {
  if (authStore.isInitialLoading) {
    const unwatch = watch(
      () => authStore.isInitialLoading,
      (loading) => {
        if (!loading) {
          fetchAnime()
          fetchCarousels()
          unwatch()
        }
      }
    )
  } else {
    fetchAnime()
    fetchCarousels()
  }
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground w-full">
    <div class="mx-auto w-full max-w-7xl px-2 lg:px-4 py-2">
      <!-- HEADER / FILTERS -->
      <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div class="flex items-center gap-4">
          <h3 class="text-xl font-semibold text-[hsl(var(--category-anime))]">Anime Library</h3>
          <button
            class="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center gap-1"
            @click="isAddModalOpen = true"
          >
            <span>+</span> Add Anime
          </button>
        </div>

        <!-- SEARCH BAR -->
        <div class="relative w-full lg:max-w-[220px] order-last lg:order-none mt-4 lg:mt-0">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            v-model="searchQuery"
            class="w-full pl-9 pr-4 py-1.5 bg-secondary/30 border border-transparent focus:border-primary focus:bg-background rounded-lg outline-none transition-all placeholder:text-muted-foreground text-sm"
            placeholder="Search anime..."
          />
        </div>

        <div class="flex flex-wrap justify-center items-center gap-2 bg-secondary/50 p-1 rounded-lg">
          <button
            v-for="filter in ['All', 'Completed', 'Planned', 'Watching', 'Dropped', 'On-Hold']"
            :key="filter"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            :class="
              selectedFilter === filter
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="setFilter(filter)"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <!-- CAROUSELS (Watching & Planned) -->
      <div v-if="!loading && !error && !isSearching && selectedFilter === 'All'" class="mb-12 space-y-8">
        <Carousel v-if="watchingLibrary.length > 0" title="Currently Watching">
          <div 
            v-for="anime in watchingLibrary" 
            :key="anime.id" 
            class="w-[200px] flex-shrink-0 snap-center"
          >
            <AnimeCard
              :anime="anime"
              @click="openDetails(anime)"
            />
          </div>
        </Carousel>

        <Carousel v-if="plannedLibrary.length > 0" title="Planned to Watch">
          <div 
            v-for="anime in plannedLibrary" 
            :key="anime.id" 
            class="w-[200px] flex-shrink-0 snap-center"
          >
            <AnimeCard
              :anime="anime"
              @click="openDetails(anime)"
            />
          </div>
        </Carousel>
      </div>

      <!-- ERROR STATE -->
      <div v-if="error" class="text-destructive text-center py-8">
        {{ error }}
        <button
          class="block mx-auto mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          @click="fetchAnime()"
        >
          Retry
        </button>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="!loading && !authStore.isInitialLoading && library.length === 0" class="text-center py-12 text-muted">
        No anime found in your library.
      </div>

      <!-- GRID -->
      <div v-else>
        <div v-if="!loading && !authStore.isInitialLoading && library.length > 0" class="mb-4 px-4 lg:px-0">

          <h3 class="text-xl font-semibold">
            {{ selectedFilter === 'All' && !isSearching ? 'Top Picks' : selectedFilter + ' Anime' }}
          </h3>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
        <AnimeCard
          v-for="anime in library"
          :key="anime.id"
          :anime="anime"
          @click="openDetails(anime)"
        />
      </div>
      </div>

      <!-- LOAD MORE -->
      <div v-if="hasMore" class="mt-12 flex justify-center">
        <button
          :disabled="loading"
          class="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-medium shadow-sm hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="fetchAnime(true)"
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
