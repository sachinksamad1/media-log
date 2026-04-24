<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
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

const groupedLibrary = computed(() => {
  const groups: Record<string, Anime[]> = {}
  library.value.forEach((anime) => {
    const key = anime.collectionName || 'Other'
    if (!groups[key]) groups[key] = []
    groups[key].push(anime)
  })
  return groups
})

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
      AnimeService.getAll(20, undefined, 'Planned'),
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
    <div class="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <!-- HEADER / FILTERS -->
      <div class="flex flex-col gap-6 mb-10">
        <!-- Top Row: Title & Action -->
        <div class="flex items-center justify-between">
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <h1 class="text-3xl font-extrabold tracking-tight text-[hsl(var(--category-anime))]">
              Anime Library
            </h1>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                class="w-1.5 h-1.5 rounded-full bg-[hsl(var(--category-anime))] animate-pulse"
              ></span>
              {{ isSearching ? 'Search results' : selectedFilter }}
            </div>
          </div>

          <button
            class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-xl bg-primary text-primary-foreground hover:ring-4 hover:ring-primary/10 hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10"
            @click="isAddModalOpen = true"
          >
            <span class="text-lg leading-none">+</span>
            <span class="hidden sm:inline">Add Anime</span>
            <span class="sm:hidden text-xs">Add</span>
          </button>
        </div>

        <!-- Bottom Row: Search & Filters -->
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <!-- Search Bar -->
          <div class="relative group flex-shrink-0 lg:w-[320px]">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[hsl(var(--category-anime))] transition-colors"
            />
            <input
              v-model="searchQuery"
              class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 hover:bg-secondary/50 border border-transparent focus:border-[hsl(var(--category-anime))]/30 focus:bg-background rounded-xl outline-none transition-all placeholder:text-muted-foreground text-sm shadow-sm"
              placeholder="Search in your library..."
            />
          </div>

          <!-- Filter Pills -->
          <div
            class="flex items-center gap-1.5 p-1 bg-secondary/40 backdrop-blur-sm rounded-xl overflow-x-auto no-scrollbar scroll-smooth"
          >
            <button
              v-for="filter in ['All', 'Completed', 'Planned', 'Watching', 'Dropped', 'On-Hold']"
              :key="filter"
              class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap active:scale-95"
              :class="
                selectedFilter === filter
                  ? 'bg-background shadow-md text-foreground ring-1 ring-black/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              "
              @click="setFilter(filter)"
            >
              {{ filter }}
            </button>
          </div>
        </div>
      </div>

      <!-- CAROUSELS (Watching & Planned) -->
      <div
        v-if="!loading && !error && !isSearching && selectedFilter === 'All'"
        class="mb-12 space-y-8"
      >
        <Carousel v-if="watchingLibrary.length > 0" title="Currently Watching">
          <div
            v-for="anime in watchingLibrary"
            :key="anime.id"
            class="w-[150px] sm:w-[180px] lg:w-[200px] flex-shrink-0 snap-center"
          >
            <AnimeCard :anime="anime" @click="openDetails(anime)" />
          </div>
        </Carousel>

        <Carousel v-if="plannedLibrary.length > 0" title="Planned to Watch">
          <div
            v-for="anime in plannedLibrary"
            :key="anime.id"
            class="w-[150px] sm:w-[180px] lg:w-[200px] flex-shrink-0 snap-center"
          >
            <AnimeCard :anime="anime" @click="openDetails(anime)" />
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
      <div
        v-else-if="!loading && !authStore.isInitialLoading && library.length === 0"
        class="text-center py-12 text-muted"
      >
        No anime found in your library.
      </div>

      <!-- GRID -->
      <div v-else>
        <div v-if="!loading && !authStore.isInitialLoading && library.length > 0" class="mb-4">
          <h3 class="text-xl font-semibold">
            {{ selectedFilter === 'All' && !isSearching ? 'Top Picks' : selectedFilter + ' Anime' }}
          </h3>
        </div>

        <div v-for="(groupList, groupName) in groupedLibrary" :key="groupName" class="mb-8">
          <h4
            v-if="groupName !== 'Other' || Object.keys(groupedLibrary).length > 1"
            class="text-lg font-bold mb-4 flex items-center gap-2"
          >
            <span
              v-if="groupName !== 'Other'"
              class="w-1.5 h-1.5 rounded-full bg-[hsl(var(--category-anime))]"
            ></span>
            {{
              groupName === 'Other'
                ? Object.keys(groupedLibrary).length > 1
                  ? 'Uncategorized'
                  : ''
                : groupName
            }}
          </h4>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
          >
            <AnimeCard
              v-for="anime in groupList"
              :key="anime.id"
              :anime="anime"
              @click="openDetails(anime)"
            />
          </div>
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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
