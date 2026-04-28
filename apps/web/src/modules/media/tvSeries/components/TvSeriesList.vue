<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { TvSeriesService } from '@modules/media/tvSeries/api/tvSeriesService'
import { useAuthStore } from '@core/stores/useAuthStore'
import type { TvSeries } from '@modules/media/tvSeries/types/types'
import TvSeriesDetailModal from '@modules/media/tvSeries/components/TvSeriesDetailModal.vue'
import AddNewTvSeriesModal from '@modules/media/tvSeries/components/AddNewTvSeriesModal.vue'
import TvSeriesCard from '@modules/media/tvSeries/components/TvSeriesCard.vue'
import Carousel from '@common/components/ui/Carousel.vue'
import { watchDebounced } from '@vueuse/core'
import { Search, ChevronDown } from 'lucide-vue-next'

// ----------------------------------------------------
// STATE
// ----------------------------------------------------
const library = ref<TvSeries[]>([])
const watchingLibrary = ref<TvSeries[]>([])
const planToWatchLibrary = ref<TvSeries[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const nextCursor = ref<string | null>(null)
const hasMore = ref(true)
const selectedFilter = ref('All')
const selectedCategory = ref('All')
const selectedGenre = ref('All')
const searchQuery = ref('')
const isSearching = ref(false)
const isCategoryOpen = ref(false)
const isGenreOpen = ref(false)

const categoryOptions = computed(() => {
  const cats = new Set<string>()
  library.value.forEach((a) => {
    if (a.collectionName) cats.add(a.collectionName)
  })
  return ['All', ...Array.from(cats).sort()]
})

const genreOptions = computed(() => {
  const genres = new Set<string>()
  library.value.forEach((a) => {
    ;(a.genres || []).forEach((g) => genres.add(g))
  })
  return ['All', ...Array.from(genres).sort()]
})

const filteredLibrary = computed(() => {
  return library.value.filter((a) => {
    const catMatch = selectedCategory.value === 'All' || a.collectionName === selectedCategory.value
    const genreMatch =
      selectedGenre.value === 'All' || (a.genres || []).includes(selectedGenre.value)
    return catMatch && genreMatch
  })
})

const groupedLibrary = computed(() => {
  const groups: Record<string, TvSeries[]> = {}
  filteredLibrary.value.forEach((item) => {
    const key = item.collectionName || 'Other'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })
  return groups
})

function setCategory(cat: string) {
  selectedCategory.value = cat
  isCategoryOpen.value = false
}

function setGenre(genre: string) {
  selectedGenre.value = genre
  isGenreOpen.value = false
}

// Modal State
const selectedShow = ref<TvSeries | null>(null)
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
  fetchLibrary()
}

function openDetails(item: TvSeries) {
  selectedShow.value = item
  isModalOpen.value = true
}

function handleUpdate(updated: TvSeries) {
  fetchLibrary()
  selectedShow.value = updated
}

function handleCreate() {
  fetchLibrary()
  fetchCarousels()
  isAddModalOpen.value = false
}

function handleDelete() {
  fetchLibrary()
  fetchCarousels()
  isModalOpen.value = false
  selectedShow.value = null
}

// ----------------------------------------------------
// FETCH CAROUSELS
// ----------------------------------------------------
async function fetchCarousels() {
  try {
    const [watching, planned] = await Promise.all([
      TvSeriesService.getAll(20, undefined, 'Watching'),
      TvSeriesService.getAll(20, undefined, 'Plan to Watch'),
    ])
    watchingLibrary.value = watching.data
    planToWatchLibrary.value = planned.data
  } catch (err) {
    console.error('Failed to load carousels', err)
  }
}

// ----------------------------------------------------
// FETCH
// ----------------------------------------------------
async function fetchLibrary(isLoadMore = false) {
  if (loading.value || (!hasMore.value && isLoadMore)) return

  try {
    loading.value = true
    const cursor = isLoadMore ? nextCursor.value || undefined : undefined

    // Pass selectedFilter
    const response = await TvSeriesService.getAll(LIMIT, cursor, selectedFilter.value)

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
        fetchLibrary()
      }
      return
    }

    isSearching.value = true
    loading.value = true
    try {
      const results = await TvSeriesService.search(q)
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
          fetchLibrary()
          fetchCarousels()
          unwatch()
        }
      }
    )
  } else {
    fetchLibrary()
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
            <h1 class="text-3xl font-extrabold tracking-tight text-[hsl(var(--category-tvseries))]">
              TV Series Library
            </h1>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                class="w-1.5 h-1.5 rounded-full bg-[hsl(var(--category-tvseries))] animate-pulse"
              ></span>
              {{ isSearching ? 'Search results' : selectedFilter }}
            </div>
          </div>

          <button
            class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-xl bg-primary text-primary-foreground hover:ring-4 hover:ring-primary/10 hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10"
            @click="isAddModalOpen = true"
          >
            <span class="text-lg leading-none">+</span>
            <span class="hidden sm:inline">Add TV Series</span>
            <span class="sm:hidden text-xs">Add</span>
          </button>
        </div>

        <!-- Bottom Row: Search & Filters -->
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <!-- Search Bar -->
          <div class="relative group flex-shrink-0 lg:w-[320px]">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[hsl(var(--category-tvseries))] transition-colors"
            />
            <input
              v-model="searchQuery"
              class="w-full pl-10 pr-4 py-2.5 bg-secondary/30 hover:bg-secondary/50 border border-transparent focus:border-[hsl(var(--category-tvseries))]/30 focus:bg-background rounded-xl outline-none transition-all placeholder:text-muted-foreground text-sm shadow-sm"
              placeholder="Search in your library..."
            />
          </div>

          <!-- Filter Pills -->
          <div
            class="flex items-center gap-1.5 p-1 bg-secondary/40 backdrop-blur-sm rounded-xl overflow-x-auto no-scrollbar scroll-smooth"
          >
            <button
              v-for="filter in ['All', 'Watching', 'Completed', 'Plan to Watch']"
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

          <!-- Category & Genre Dropdowns -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <div class="relative" @blur.capture="isCategoryOpen = false">
              <button
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-secondary/40 hover:bg-secondary/60 border"
                :class="
                  selectedCategory !== 'All'
                    ? 'border-[hsl(var(--category-tvseries))]/40 text-[hsl(var(--category-tvseries))]'
                    : 'border-transparent text-muted-foreground'
                "
                @click.stop="
                  isCategoryOpen = !isCategoryOpen
                  isGenreOpen = false
                "
              >
                <span class="hidden sm:inline">Category:</span>
                <span class="max-w-[90px] truncate">{{ selectedCategory }}</span>
                <ChevronDown
                  class="w-3.5 h-3.5 transition-transform"
                  :class="{ 'rotate-180': isCategoryOpen }"
                />
              </button>
              <Transition name="dropdown">
                <div
                  v-if="isCategoryOpen"
                  class="absolute z-50 top-full mt-1.5 left-0 min-w-[160px] bg-popover border border-border rounded-xl shadow-xl overflow-hidden"
                >
                  <button
                    v-for="cat in categoryOptions"
                    :key="cat"
                    class="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-secondary/50"
                    :class="
                      selectedCategory === cat
                        ? 'font-semibold text-[hsl(var(--category-tvseries))]'
                        : 'text-foreground'
                    "
                    @click="setCategory(cat)"
                  >
                    {{ cat === 'All' ? 'All Categories' : cat }}
                  </button>
                </div>
              </Transition>
            </div>
            <div class="relative" @blur.capture="isGenreOpen = false">
              <button
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all bg-secondary/40 hover:bg-secondary/60 border"
                :class="
                  selectedGenre !== 'All'
                    ? 'border-[hsl(var(--category-tvseries))]/40 text-[hsl(var(--category-tvseries))]'
                    : 'border-transparent text-muted-foreground'
                "
                @click.stop="
                  isGenreOpen = !isGenreOpen
                  isCategoryOpen = false
                "
              >
                <span class="hidden sm:inline">Genre:</span>
                <span class="max-w-[90px] truncate">{{ selectedGenre }}</span>
                <ChevronDown
                  class="w-3.5 h-3.5 transition-transform"
                  :class="{ 'rotate-180': isGenreOpen }"
                />
              </button>
              <Transition name="dropdown">
                <div
                  v-if="isGenreOpen"
                  class="absolute z-50 top-full mt-1.5 left-0 min-w-[160px] max-h-60 overflow-y-auto bg-popover border border-border rounded-xl shadow-xl"
                >
                  <button
                    v-for="genre in genreOptions"
                    :key="genre"
                    class="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-secondary/50"
                    :class="
                      selectedGenre === genre
                        ? 'font-semibold text-[hsl(var(--category-tvseries))]'
                        : 'text-foreground'
                    "
                    @click="setGenre(genre)"
                  >
                    {{ genre === 'All' ? 'All Genres' : genre }}
                  </button>
                </div>
              </Transition>
            </div>
            <button
              v-if="selectedCategory !== 'All' || selectedGenre !== 'All'"
              class="text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1.5 rounded-lg hover:bg-destructive/10"
              @click="
                selectedCategory = 'All'
                selectedGenre = 'All'
              "
            >
              Clear
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
            v-for="tvSeries in watchingLibrary"
            :key="tvSeries.id"
            class="w-[150px] sm:w-[180px] lg:w-[200px] flex-shrink-0 snap-center"
          >
            <TvSeriesCard :tv-series="tvSeries" @click="openDetails(tvSeries)" />
          </div>
        </Carousel>

        <Carousel v-if="planToWatchLibrary.length > 0" title="Planned to Watch">
          <div
            v-for="tvSeries in planToWatchLibrary"
            :key="tvSeries.id"
            class="w-[150px] sm:w-[180px] lg:w-[200px] flex-shrink-0 snap-center"
          >
            <TvSeriesCard :tv-series="tvSeries" @click="openDetails(tvSeries)" />
          </div>
        </Carousel>
      </div>

      <!-- ERROR STATE -->
      <div v-if="error" class="text-destructive text-center py-8">
        {{ error }}
        <button
          class="block mx-auto mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          @click="fetchLibrary()"
        >
          Retry
        </button>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-else-if="!loading && !authStore.isInitialLoading && filteredLibrary.length === 0"
        class="text-center py-12 text-muted"
      >
        {{
          library.length === 0
            ? 'No TV Series found in your library.'
            : 'No TV Series match the selected filters.'
        }}
      </div>

      <!-- GRID -->
      <div v-else>
        <div
          v-if="!loading && !authStore.isInitialLoading && filteredLibrary.length > 0"
          class="mb-4"
        >
          <h3 class="text-xl font-semibold">
            {{
              selectedFilter === 'All' && !isSearching
                ? 'Top Picks'
                : selectedFilter + (selectedFilter === 'All' ? '' : ' TV Series')
            }}
          </h3>
        </div>

        <div v-for="(groupList, groupName) in groupedLibrary" :key="groupName" class="mb-8">
          <h4
            v-if="groupName !== 'Other' || Object.keys(groupedLibrary).length > 1"
            class="text-lg font-bold mb-4 flex items-center gap-2"
          >
            <span
              v-if="groupName !== 'Other'"
              class="w-1.5 h-1.5 rounded-full bg-[hsl(var(--category-tvseries))]"
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
            <TvSeriesCard
              v-for="tvSeries in groupList"
              :key="tvSeries.id"
              :tv-series="tvSeries"
              @click="openDetails(tvSeries)"
            />
          </div>
        </div>
      </div>

      <!-- LOAD MORE -->
      <div v-if="hasMore" class="mt-12 flex justify-center">
        <button
          :disabled="loading"
          class="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-medium shadow-sm hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="fetchLibrary(true)"
        >
          {{ loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>

    <!-- Modals -->
    <TvSeriesDetailModal
      v-if="selectedShow"
      :tv-series="selectedShow"
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @update="handleUpdate"
      @delete="handleDelete"
    />

    <AddNewTvSeriesModal
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
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
