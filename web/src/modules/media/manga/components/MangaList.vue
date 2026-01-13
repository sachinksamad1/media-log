<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MangaService } from '../services/manga.service';
import type { Manga } from '../types';
import MediaCard from '../../../components/ui/MediaCard.vue';

const mangas = ref<Manga[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function fetchMangas() {
  loading.value = true;
  error.value = null;
  try {
    mangas.value = await MangaService.getAll();
  } catch (err) {
    error.value = 'Failed to load anime library';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchMangas();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-display font-bold text-foreground">Manga Library</h1>
      <span class="text-muted-foreground">{{ mangas.length }} items</span>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-3">
      <span>{{ error }}</span>
      <button @click="fetchMangas" class="text-sm underline hover:no-underline">Retry</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div v-for="i in 10" :key="i" class="space-y-3">
        <div class="aspect-[2/3] bg-secondary/50 rounded-lg animate-pulse" />
        <div class="h-4 w-3/4 bg-secondary/50 rounded animate-pulse" />
        <div class="h-3 w-1/2 bg-secondary/30 rounded animate-pulse" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="mangas.length === 0" class="text-center py-12">
      <p class="text-muted-foreground">No manga found in your library.</p>
    </div>

    <!-- Content Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <MediaCard 
        v-for="manga in mangas" 
        :key="manga.id" 
        :media="manga"
      >
        <template #meta>
          <div class="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{{ manga.chaptersRead }} / {{ manga.totalChapters || '?' }} CH</span>
            <span>{{ manga.author }}</span>
          </div>
        </template>
      </MediaCard>
    </div>
  </div>
</template>