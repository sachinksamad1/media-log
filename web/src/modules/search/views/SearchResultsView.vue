<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchService } from '../api/searchService'
import type { GlobalSearchResponse } from '../types'
import MediaCard from '@/common/components/ui/MediaCard.vue'
import type { MediaItem, MediaType, MediaStatus } from '@/common/types/media'

const route = useRoute()
const results = ref<GlobalSearchResponse[]>([])
const loading = ref(false)
const error = ref('')

const performSearch = async (query: string) => {
  if (!query) return
  loading.value = true
  error.value = ''
  try {
    results.value = await searchService.search(query)
  } catch (e) {
    error.value = 'Failed to search'
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(
  () => route.query.q,
  (newQuery) => {
    if (typeof newQuery === 'string') {
      performSearch(newQuery)
    } else if (!newQuery) {
      results.value = []
    }
  },
  { immediate: true }
)

const mapToMediaItem = (item: GlobalSearchResponse): MediaItem => ({
  id: item.id,
  title: item.title,
  type: item.mediaType as MediaType,
  status: (item.userStats.status || 'planned') as MediaStatus,
  coverUrl: item.imageUrl,
  rating: item.userStats.score,
  year: item.createdAt ? new Date(item.createdAt).getFullYear() : undefined,
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Search Results for "{{ route.query.q }}"</h1>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="results.length === 0" class="text-center py-12 text-muted-foreground">
      No results found.
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <MediaCard v-for="item in results" :key="item.id" :item="mapToMediaItem(item)" />
    </div>
  </div>
</template>
