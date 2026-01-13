<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import { computed } from 'vue'

const { sidebarOpen, sidebarCollapsed } = useLayout()

const mainClasses = computed(() => ({
  'lg:ml-16': sidebarCollapsed.value,
  'lg:ml-50': !sidebarCollapsed.value,
}))
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppHeader />

    <div class="flex pt-16">
      <AppSidebar
        v-model:open="sidebarOpen"
        v-model:collapsed="sidebarCollapsed"
      />

      <main
        class="flex-1 transition-all duration-300"
        :class="mainClasses"
      >
        <slot />
      </main>
    </div>
  </div>
</template>
