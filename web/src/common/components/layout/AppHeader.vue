<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Bell, User, Menu, LogOut, Settings } from "lucide-vue-next"
import { onClickOutside } from '@vueuse/core'
import ThemeToggle from "../ui/ThemeToggle.vue"
import { useLayout } from "../../composables/useLayout"
import { useAuthStore } from '@/core/stores/useAuthStore'

const { toggleSidebar } = useLayout()
const router = useRouter()
const authStore = useAuthStore()
const isProfileOpen = ref(false)
const profileDropdownRef = ref(null)

onClickOutside(profileDropdownRef, () => {
  isProfileOpen.value = false
})

const userInitials = computed(() => {
  const displayName = authStore.profile?.displayName || authStore.user?.displayName || authStore.user?.email || 'User'
  return displayName.substring(0, 2).toUpperCase()
})

const userDisplayName = computed(() => {
  return authStore.profile?.displayName || authStore.user?.displayName || 'User'
})

const userEmail = computed(() => {
  return authStore.profile?.email || authStore.user?.email || ''
})

const userAvatar = computed(() => {
  return authStore.profile?.avatarImg || authStore.user?.photoURL
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/auth')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
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
          <!-- Search Icon -->
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
        <!-- Search -->
        <button
          class="md:hidden text-muted-foreground hover:text-foreground hover:bg-secondary p-2 rounded-md"
        >
          <Search class="h-5 w-5" />
        </button>

        <!-- Theme Toggle -->
        <ThemeToggle />

        <!-- Notifications -->
        <button class="text-muted-foreground hover:text-foreground hover:bg-secondary p-2 rounded-md">
          <Bell class="h-5 w-5" />
        </button>

        <!-- User Profile -->
        <div class="relative" ref="profileDropdownRef">
          <button 
            @click="isProfileOpen = !isProfileOpen"
            class="text-muted-foreground hover:text-foreground hover:bg-secondary p-2 rounded-md outline-none"
          >
            <div 
              v-if="userAvatar"
              class="w-8 h-8 rounded-full overflow-hidden border border-border"
            >
              <img :src="userAvatar" alt="User" class="w-full h-full object-cover" />
            </div>
            <div 
              v-else
              class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-medium text-xs shadow-lg shadow-primary/20"
            >
              {{ userInitials }}
            </div>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="isProfileOpen"
            class="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden"
          >
            <!-- User Header -->
            <div class="p-4 border-b border-border bg-muted/30">
              <p class="font-medium text-sm text-foreground truncate">{{ userDisplayName }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ userEmail }}</p>
            </div>

            <!-- Menu Items -->
            <div class="p-1">
              <button 
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-secondary transition-colors"
                @click="() => { isProfileOpen = false; router.push('/profile') }"
              >
                <User class="w-4 h-4 text-muted-foreground" />
                Profile
              </button>
              <button 
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-secondary transition-colors"
                @click="() => { isProfileOpen = false; router.push('/settings') }"
              >
                <Settings class="w-4 h-4 text-muted-foreground" />
                Settings
              </button>
            </div>

            <div class="h-px bg-border mx-1"></div>

            <div class="p-1">
              <button 
                @click="handleLogout"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut class="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
