<script setup lang="ts">
import { BaseMedia } from '@/types/media';

defineProps<{
  media: BaseMedia;
  extra?: string;
}>();
</script>

<template>
  <div class="card bg-base-200 shadow-sm">
    <figure v-if="media.coverImage">
      <img :src="media.coverImage" class="h-48 w-full object-cover" />
    </figure>

    <div class="card-body">
      <h2 class="card-title">{{ media.title }}</h2>

      <div class="flex justify-between text-sm opacity-70">
        <span>Status: {{ media.status }}</span>
        <span v-if="media.rating">⭐ {{ media.rating }}</span>
      </div>

      <slot name="meta" />

      <div class="card-actions justify-end">
        <button class="btn btn-sm btn-primary">View</button>
      </div>
    </div>
  </div>
</template>
