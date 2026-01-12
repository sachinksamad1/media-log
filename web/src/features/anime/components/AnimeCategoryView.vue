<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { AnimeService } from '../services/anime.service'
import type { Anime } from '../types'
import { ITEMS_PER_PAGE } from '../../../utils/constraints'

const route = useRoute()

const viewMode = ref<'grid' | 'row'>('grid')
const page = ref(1)

const library = ref<Anime[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const status = computed(() => {
  const s = route.params.status as string
  return s.charAt(0).toUpperCase() + s.slice(1)
})

const fetchData = async () => {
  loading.value = true
  try {
    const data = await AnimeService.getAll()
    library.value = data.filter(a => a.userStats.status === status.value)
  } catch {
    error.value = 'Failed to load anime'
  } finally {
    loading.value = false
  }
}

watch(() => route.params.status, () => {
  page.value = 1
  fetchData()
})

onMounted(fetchData)

const pageCount = computed(() =>
  Math.ceil(library.value.length / ITEMS_PER_PAGE)
)

const paged = computed(() => {
  const start = (page.value - 1) * ITEMS_PER_PAGE
  return library.value.slice(start, start + ITEMS_PER_PAGE)
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground p-6">

    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gradient">
        {{ status }} Anime
      </h1>

      <div class="flex gap-3">
        <button
          @click="viewMode = 'grid'"
          class="px-3 py-1 border border-border rounded"
          :class="viewMode === 'grid' ? 'bg-card shadow-card' : 'opacity-50'"
        >
          Grid
        </button>

        <button
          @click="viewMode = 'row'"
          class="px-3 py-1 border border-border rounded"
          :class="viewMode === 'row' ? 'bg-card shadow-card' : 'opacity-50'"
        >
          Row
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-muted">Loading…</div>
    <div v-else-if="error" class="text-destructive">{{ error }}</div>

    <div
      v-else
      :class="viewMode === 'grid'
        ? 'grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6'
        : 'flex flex-col gap-4'
      "
    >
      <div
        v-for="anime in paged"
        :key="anime.id"
        class="group bg-card border border-border rounded-xl overflow-hidden shadow-card transition-spring hover:-translate-y-2 hover:shadow-card-hover"
        :class="viewMode === 'row' ? 'flex gap-4 p-3 items-center' : ''"
      >
        <img
          :src="anime.imageUrl"
          :alt="anime.title"
          :class="viewMode === 'grid'
            ? 'w-full h-[220px] object-cover'
            : 'w-[100px] h-[140px] object-cover rounded'
          "
        />

        <div class="p-4">
          <h4 class="font-semibold mb-1">
            {{ anime.title }}
          </h4>

          <p class="text-sm font-semibold text-[hsl(var(--accent))]">
            ⭐ {{ anime.userStats.score }}
          </p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-10">
      <button
        class="px-4 py-2 border border-border rounded"
        :disabled="page === 1"
        @click="page--"
      >
        Prev
      </button>

      <span class="text-sm text-muted">
        Page {{ page }} of {{ pageCount }}
      </span>

      <button
        class="px-4 py-2 border border-border rounded"
        :disabled="page === pageCount"
        @click="page++"
      >
        Next
      </button>
    </div>

  </div>
</template>
