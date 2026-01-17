<script setup lang="ts">
import MangaList from '@/modules/media/manga/components/MangaList.vue'
</script>

<template>
  <div class="mx-auto w-full flex flex-col px-2 lg:px-4">
    <h2 class="text-3xl font-bold mb-8 text-gradient pt-6">
      My Manga Library
    </h2>
    <div class="flex flex-wrap gap-6">
      <MangaList />
    </div>
  </div>
</template> 
