<script setup lang="ts">
import { useTheme } from "../../composables/useTheme"
import { Sun, Moon } from "lucide-vue-next"

const { toggle } = useTheme()
</script>

<template>
  <button
    @click="toggle"
    class="relative w-9 h-9 flex items-center justify-center
           rounded-md bg-card border border-border
           hover:bg-primary/10 transition"
  >
    <Sun class="absolute h-5 w-5 transition-all sun-icon" />
    <Moon class="absolute h-5 w-5 transition-all moon-icon" />
  </button>
</template>
