<script setup lang="ts">
import { Search, Bell, User, Menu } from "lucide-vue-next"
import ThemeToggle from "../ui/ThemeToggle.vue"
import { useLayout } from "../../composables/useLayout"

const { toggleSidebar } = useLayout()
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 h-16 bg-background backdrop-blur-xl border-b border-border"
  >
    <div class="flex items-center justify-between h-full px-4 lg:px-6">

      <!-- Left section -->
      <div class="flex items-center gap-4">
        <button
          class="lg:hidden text-foreground hover:bg-secondary p-2 rounded-md"
          @click="toggleSidebar"
        >
          <Menu class="h-5 w-5" />
        </button>

        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span class="font-bold text-sm">M</span>
          </div>
          <h1 class="text-xl font-display font-bold text-foreground hidden sm:block">
            Media<span class="text-gradient">Log</span>
          </h1>
        </div>
      </div>

      <!-- Center Search -->
      <div class="flex-1 max-w-md mx-4 hidden md:block">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <input
            type="search"
            placeholder="Search your library..."
            class="w-full pl-10 bg-secondary/50 border border-border rounded-md px-3 py-2
                   focus:bg-secondary focus:border-primary/50 transition-all outline-none"
          />
        </div>
      </div>

      <!-- Right section -->
      <div class="flex items-center gap-2">
        <button
          class="md:hidden text-muted-foreground hover:text-foreground hover:bg-secondary p-2 rounded-md"
        >
          <Search class="h-5 w-5" />
        </button>

        <ThemeToggle />

        <button class="text-muted-foreground hover:text-foreground hover:bg-secondary p-2 rounded-md">
          <Bell class="h-5 w-5" />
        </button>

        <button class="text-muted-foreground hover:text-foreground hover:bg-secondary p-2 rounded-md">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User class="h-4 w-4 text-primary-foreground" />
          </div>
        </button>
      </div>
    </div>
  </header>
</template>
