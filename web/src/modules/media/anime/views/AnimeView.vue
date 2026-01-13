<script setup lang="ts">
import AnimeList from '@/modules/media/anime/components/AnimeList.vue'
</script>

<template>
  <div class="mx-auto w-full flex flex-col px-2 lg:px-4">
    <h2 class="text-3xl font-bold mb-8 text-gradient pt-6">
      My Anime Library
    </h2>
    <div class="flex flex-wrap gap-6">
      <AnimeList />
    </div>
  </div>
</template> 