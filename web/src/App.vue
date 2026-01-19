<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppShell from '@/common/components/layout/AppShell.vue'
import { Toaster } from '@/common/components/ui/toast'
import { useAuthStore } from '@/core/stores/useAuthStore'

const authStore = useAuthStore()
const route = useRoute()
authStore.initializeListener()
</script>

<template>
  <AppShell v-if="!route.meta?.hideLayout">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <RouterView />
    </div>
  </AppShell>
  <RouterView v-else />
  <Toaster />
</template>
