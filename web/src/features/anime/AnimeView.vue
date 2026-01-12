<script setup lang="ts">
import AnimeList from './components/AnimeList.vue'
</script>

<template>
  <div class="mx-auto w-full max-w-[1600px] px-4 lg:px-8">
    <h2 class="text-3xl font-bold mb-8 text-gradient pt-6">
      My Anime Library
    </h2>
    <div class="flex flex-wrap gap-6">
      <AnimeList />
    </div>
  </div>
</template>
