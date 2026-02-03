<script setup lang="ts">
import { useTheme } from '../../composables/useTheme'
import { Sun, Moon } from 'lucide-vue-next'

const { toggle } = useTheme()
</script>

<template>
  <button class="relative w-9 h-9 flex items-center justify-center rounded-md" @click="toggle">
    <Sun class="absolute h-5 w-5 transition-all sun-icon" />
    <Moon class="absolute h-5 w-5 transition-all moon-icon" />
  </button>
</template>
