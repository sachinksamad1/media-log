<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppShell from '@/common/components/layout/AppShell.vue'
import { Toaster } from '@/common/components/ui/toast'
import { useAuthStore } from '@/core/stores/useAuthStore'
import AuthLoader from '@/common/components/loader/AuthLoader.vue'

const authStore = useAuthStore()
const route = useRoute()
authStore.initializeListener()
</script>

<template>
  <Transition name="fade">
    <AuthLoader v-if="authStore.isInitialLoading" />
  </Transition>

  <div v-if="!authStore.isInitialLoading">
    <AppShell v-if="!route.meta?.hideLayout">
      <RouterView />
    </AppShell>
    <RouterView v-else />
    <Toaster />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
