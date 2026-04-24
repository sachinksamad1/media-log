<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { FictionService } from '@modules/media/fiction/api/fictionService'
import { useAuthStore } from '@core/stores/useAuthStore'
import type { Fiction } from '@modules/media/fiction/types/types'
import FictionDetailModal from '@modules/media/fiction/components/FictionDetailModal.vue'
import AddNewFictionModal from '@modules/media/fiction/components/AddNewFictionModal.vue'
import FictionCard from '@modules/media/fiction/components/FictionCard.vue'
import Carousel from '@common/components/ui/Carousel.vue'
import { watchDebounced } from '@vueuse/core'
import { Search } from 'lucide-vue-next'

// ----------------------------------------------------
// STATE
// ----------------------------------------------------
const library = ref<Fiction[]>([])
const readingLibrary = ref<Fiction[]>([])
const plannedLibrary = ref<Fiction[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const nextCursor = ref<string | null>(null)
const hasMore = ref(true)
const selectedFilter = ref('All')
const searchQuery = ref('')
const isSearching = ref(false)

// Modal State
const selectedFiction = ref<Fiction | null>(null)
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
  fetchFiction()
}

function openDetails(item: Fiction) {
  selectedFiction.value = item
  isModalOpen.value = true
}

function handleUpdate(updated: Fiction) {
  fetchFiction()
  selectedFiction.value = updated
}

function handleCreate() {
  fetchFiction()
  fetchCarousel()
  isAddModalOpen.value = false
}

function handleDelete() {
  fetchFiction()
  fetchCarousel()
  isModalOpen.value = false
  selectedFiction.value = null
}

// ----------------------------------------------------
// FETCH CAROUSELS
// ----------------------------------------------------
async function fetchCarousel() {
  try {
    const [reading, planned] = await Promise.all([
      FictionService.getAll(20, undefined, 'Reading'),
      FictionService.getAll(20, undefined, 'Planned'),
    ])
    readingLibrary.value = reading.data
    plannedLibrary.value = planned.data
  } catch (err) {
    console.error('Failed to load carousels', err)
  }
}

// ----------------------------------------------------
// FETCH
// ----------------------------------------------------
async function fetchFiction(isLoadMore = false) {
  if (loading.value || (!hasMore.value && isLoadMore)) return

  try {
    loading.value = true
    const cursor = isLoadMore ? nextCursor.value || undefined : undefined

    // Pass selectedFilter
    const response = await FictionService.getAll(LIMIT, cursor, selectedFilter.value)

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
        fetchFiction()
      }
      return
    }

    isSearching.value = true
    loading.value = true
    try {
      const results = await FictionService.search(q)
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
          fetchFiction()
          fetchCarousel()
          unwatch()
        }
      }
    )
  } else {
    fetchFiction()
    fetchCarousel()
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
            <h1 class="text-3xl font-extrabold tracking-tight text-[hsl(var(--category-fiction))]">
              Fiction Library
            </h1>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                class="w-1.5 h-1.5 rounded-full bg-[hsl(var(--category-fiction))] animate-pulse"
              ></span>
              {{ isSearching ? 'Search results' : selectedFilter }}
            </div>
          </div>

          <button
            class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-xl bg-primary text-primary-foreground hover:ring-4 hover:ring-primary/10 hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10"
            @click="isAddModalOpen = true"
          >
            <span class="text-lg leading-none">+</span>
            <span class="hidden sm:inline">Add Fiction</span>
            <span class="sm:hidden text-xs">Add</span>
          </button>
        </div>

        <!-- Bottom Row: Search & Filters -->
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <!-- Search Bar -->
          <div class="relative group flex-shrink-0 lg:w-[320px]">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[hsl(var(--category-fiction))] transition-colors"
            />
            <input
              v-model="searchQuery"
              class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 hover:bg-secondary/50 border border-transparent focus:border-[hsl(var(--category-fiction))]/30 focus:bg-background rounded-xl outline-none transition-all placeholder:text-muted-foreground text-sm shadow-sm"
              placeholder="Search in your library..."
            />
          </div>

          <!-- Filter Pills -->
          <div
            class="flex items-center gap-1.5 p-1 bg-secondary/40 backdrop-blur-sm rounded-xl overflow-x-auto no-scrollbar scroll-smooth"
          >
            <button
              v-for="filter in ['All', 'Completed', 'Planned', 'Reading', 'Dropped', 'On-Hold']"
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

      <!-- CAROUSELS (Reading & Planned) -->
      <div
        v-if="!loading && !error && !isSearching && selectedFilter === 'All'"
        class="mb-12 space-y-8"
      >
        <Carousel v-if="readingLibrary.length > 0" title="Currently Reading">
          <div
            v-for="fiction in readingLibrary"
            :key="fiction.id"
            class="w-[150px] sm:w-[180px] lg:w-[200px] flex-shrink-0 snap-center"
          >
            <FictionCard :fiction="fiction" @click="openDetails(fiction)" />
          </div>
        </Carousel>

        <Carousel v-if="plannedLibrary.length > 0" title="Planned to Read">
          <div
            v-for="fiction in plannedLibrary"
            :key="fiction.id"
            class="w-[150px] sm:w-[180px] lg:w-[200px] flex-shrink-0 snap-center"
          >
            <FictionCard :fiction="fiction" @click="openDetails(fiction)" />
          </div>
        </Carousel>
      </div>

      <!-- ERROR STATE -->
      <div v-if="error" class="text-destructive text-center py-8">
        {{ error }}
        <button
          class="block mx-auto mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          @click="fetchFiction()"
        >
          Retry
        </button>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-else-if="!loading && !authStore.isInitialLoading && library.length === 0"
        class="text-center py-12 text-muted"
      >
        No fiction found in your library.
      </div>

      <!-- GRID -->
      <div v-else>
        <div v-if="!loading && !authStore.isInitialLoading && library.length > 0" class="mb-4">
          <h3 class="text-xl font-semibold">
            {{
              selectedFilter === 'All' && !isSearching ? 'Top Picks' : selectedFilter + ' Fiction'
            }}
          </h3>
        </div>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
        >
          <FictionCard
            v-for="fiction in library"
            :key="fiction.id"
            :fiction="fiction"
            @click="openDetails(fiction)"
          />
        </div>
      </div>

      <!-- LOAD MORE -->
      <div v-if="hasMore" class="mt-12 flex justify-center">
        <button
          :disabled="loading"
          class="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-medium shadow-sm hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="fetchFiction(true)"
        >
          {{ loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>

    <!-- Modals -->
    <FictionDetailModal
      v-if="selectedFiction"
      :fiction="selectedFiction"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @update="handleUpdate"
      @delete="handleDelete"
    />

    <AddNewFictionModal
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
