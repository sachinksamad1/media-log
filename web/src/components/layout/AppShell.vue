<script setup lang="ts">
    import { ref } from 'vue';
    import AppHeader from './AppHeader.vue';
    import AppSidebar from './AppSidebar.vue';
    import { RouterView } from 'vue-router';
  

    const sidebarOpen = ref(false);
    const sidebarCollapsed = ref(false);

    const toggleSidebar = () => {
        sidebarOpen.value = !sidebarOpen.value
    }
    
    const closeSidebar = () => {
        sidebarOpen.value = false;
    }

    const toggleCollapse = () => {
        sidebarCollapsed.value = !sidebarCollapsed.value;
    }
</script>
<template>
  <div class="min-h-screen bg-background overflow-x-hidden">
    <AppHeader :onMenuClick="toggleSidebar" />

    <AppSidebar 
      :isOpen="sidebarOpen"
      :isCollapsed="sidebarCollapsed"
      :onClose="closeSidebar"
      :onToggleCollapse="toggleCollapse"
    />

    <main
      class="pt-16 min-h-screen transition-all duration-300 ease-in-out"
      :class="[sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-50']"
    >
      <div class="px-4 lg:px-8">
        <div class="mx-auto w-full max-w-[1600px]">
          <RouterView />
        </div>
      </div>
    </main>
  </div>
</template>
