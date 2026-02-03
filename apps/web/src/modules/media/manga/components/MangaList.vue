<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { MangaService } from '@modules/media/manga/api/manga.service'
import { useAuthStore } from '@/core/stores/useAuthStore'
import type { Manga } from '@modules/media/manga/types/types'
import MangaDetailModal from '@modules/media/manga/components/MangaDetailModal.vue'
import AddNewMangaModal from '@modules/media/manga/components/AddNewMangaModal.vue'
import MangaCard from '@modules/media/manga/components/MangaCard.vue'
import Carousel from '@common/components/ui/Carousel.vue'
import { watchDebounced } from '@vueuse/core'
import { Search } from 'lucide-vue-next'

// ----------------------------------------------------
// STATE
// ----------------------------------------------------
const library = ref<Manga[]>([])
const readingList = ref<Manga[]>([])
const plannedList = ref<Manga[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const nextCursor = ref<string | null>(null)
const hasMore = ref(true)
const selectedFilter = ref('All')
const searchQuery = ref('')
const isSearching = ref(false)

// Modal State
const selectedManga = ref<Manga | null>(null)
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
  fetchManga()
}

function openDetails(manga: Manga) {
  selectedManga.value = manga
  isModalOpen.value = true
}

function handleUpdate(updated: Manga) {
  // Reload the list to ensure data consistency
  fetchManga()
  fetchFeatured()
  selectedManga.value = updated
}

function handleCreate() {
  // Reload list to include new item in correct order/filter
  fetchManga()
  fetchFeatured()
  isAddModalOpen.value = false
}

function handleDelete() {
  fetchManga()
  fetchFeatured()
  isModalOpen.value = false
  selectedManga.value = null
}

// ----------------------------------------------------
// FETCH
// ----------------------------------------------------
async function fetchFeatured() {
  try {
    const [reading, planned] = await Promise.all([
      MangaService.getAll(10, undefined, 'Reading'),
      MangaService.getAll(10, undefined, 'Planned'),
    ])
    readingList.value = reading.data
    plannedList.value = planned.data
  } catch (e) {
    console.error('Failed to fetch featured lists', e)
  }
}

async function fetchManga(isLoadMore = false) {
  if (loading.value || (!hasMore.value && isLoadMore)) return

  try {
    loading.value = true
    const cursor = isLoadMore ? nextCursor.value || undefined : undefined

    // Pass selectedFilter
    const response = await MangaService.getAll(LIMIT, cursor, selectedFilter.value)

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
        fetchManga()
      }
      return
    }

    isSearching.value = true
    loading.value = true
    try {
      const results = await MangaService.search(q)
      library.value = results
      hasMore.value = false
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
          fetchManga()
          fetchFeatured()
          unwatch()
        }
      }
    )
  } else {
    fetchManga()
    fetchFeatured()
  }
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground w-full">
    <div class="mx-auto w-full max-w-7xl px-2 lg:px-4 py-2">
      <!-- HEADER / FILTERS -->
      <div class="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
        <div class="flex items-center gap-4">
          <h3 class="text-xl font-semibold text-[hsl(var(--category-manga))]">Manga Library</h3>
          <button
            class="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center gap-1"
            @click="isAddModalOpen = true"
          >
            <span>+</span> Add Manga
          </button>
        </div>

        <!-- SEARCH BAR -->
        <div class="relative w-full lg:max-w-[220px] order-last lg:order-none mt-4 lg:mt-0">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            v-model="searchQuery"
            class="w-full pl-9 pr-4 py-1.5 bg-secondary/30 border border-transparent focus:border-primary focus:bg-background rounded-lg outline-none transition-all placeholder:text-muted-foreground text-sm"
            placeholder="Search manga..."
          />
        </div>

        <div
          class="flex flex-wrap justify-center items-center gap-2 bg-secondary/50 p-1 rounded-lg"
        >
          <button
            v-for="filter in ['All', 'Completed', 'Planned', 'Reading', 'Dropped', 'On-Hold']"
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

      <!-- ERROR STATE -->
      <div v-if="error" class="text-destructive text-center py-8">
        {{ error }}
        <button
          class="block mx-auto mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          @click="fetchManga()"
        >
          Retry
        </button>
      </div>

      <!-- CAROUSELS (Reading & Planned) -->
      <div
        v-if="!loading && !error && !isSearching && selectedFilter === 'All'"
        class="mb-12 space-y-8"
      >
        <Carousel v-if="readingList.length > 0" title="Currently Reading">
          <MangaCard
            v-for="manga in readingList"
            :key="manga.id"
            :manga="manga"
            class="min-w-[200px] w-[200px]"
            @click="openDetails(manga)"
          />
        </Carousel>

        <Carousel v-if="plannedList.length > 0" title="Planned">
          <MangaCard
            v-for="manga in plannedList"
            :key="manga.id"
            :manga="manga"
            class="min-w-[200px] w-[200px]"
            @click="openDetails(manga)"
          />
        </Carousel>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-if="!loading && !authStore.isInitialLoading && library.length === 0"
        class="text-center py-12 text-muted"
      >
        No manga found in your library.
      </div>

      <!-- GRID -->
      <div v-else>
        <div
          v-if="!loading && !authStore.isInitialLoading && library.length > 0"
          class="mb-4 px-4 lg:px-0"
        >
          <h3 class="text-xl font-semibold">
            {{ selectedFilter === 'All' && !isSearching ? 'Top Picks' : selectedFilter + ' Manga' }}
          </h3>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
          <MangaCard
            v-for="manga in library"
            :key="manga.id"
            :manga="manga"
            @click="openDetails(manga)"
          />
        </div>
      </div>

      <!-- LOAD MORE -->
      <div v-if="hasMore" class="mt-12 flex justify-center">
        <button
          :disabled="loading"
          class="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-medium shadow-sm hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="fetchManga(true)"
        >
          {{ loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>

    <!-- Modals -->
    <MangaDetailModal
      v-if="selectedManga"
      :manga="selectedManga"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @update="handleUpdate"
      @delete="handleDelete"
    />

    <AddNewMangaModal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
      @created="handleCreate"
    />
  </div>
</template>
