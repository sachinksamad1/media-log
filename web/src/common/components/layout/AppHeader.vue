<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute, type LocationQueryValue } from 'vue-router'
import {
  Search,
  Bell,
  User,
  Menu,
  LogOut,
  Settings,
  Plus,
  Edit,
  Trash,
  CheckCircle,
} from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { userActivityService } from '@/modules/user-activity/service'
import type { UserActivity } from '@/modules/user-activity/types'
import ThemeToggle from '../ui/ThemeToggle.vue'
import { useLayout } from '../../composables/useLayout'
import { useAuthStore } from '@/core/stores/useAuthStore'

const { toggleSidebar } = useLayout()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const isProfileOpen = ref(false)
const profileDropdownRef = ref(null)

const activities = ref<UserActivity[]>([])
const isNotificationsOpen = ref(false)
const notificationDropdownRef = ref(null)

onClickOutside(notificationDropdownRef, () => {
  isNotificationsOpen.value = false
})

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) {
    fetchActivities()
  }
}

const fetchActivities = async () => {
  try {
    activities.value = await userActivityService.getRecent(10)
  } catch (e) {
    console.error(e)
  }
}

const formatActivityTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value },
    })
  }
}

// Sync search input with URL query
watch(
  () => route.query.q,
  (newQuery: LocationQueryValue | LocationQueryValue[] | undefined) => {
    if (typeof newQuery === 'string') {
      searchQuery.value = newQuery
    } else {
      searchQuery.value = ''
    }
  },
  { immediate: true }
)

onClickOutside(profileDropdownRef, () => {
  isProfileOpen.value = false
})

const userInitials = computed(() => {
  const displayName =
    authStore.profile?.displayName || authStore.user?.displayName || authStore.user?.email || 'User'
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
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search your library..."
            class="w-full pl-10 bg-secondary/50 border border-border rounded-md px-3 py-2 focus:bg-secondary focus:border-primary/50 transition-all outline-none"
            @keydown.enter="handleSearch"
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
        <!-- Notifications -->
        <div ref="notificationDropdownRef" class="relative">
          <button
            class="text-muted-foreground hover:text-foreground hover:bg-secondary p-2 rounded-md outline-none"
            :class="{ 'text-foreground bg-secondary': isNotificationsOpen }"
            @click="toggleNotifications"
          >
            <Bell class="h-5 w-5" />
          </button>

          <!-- Notification Dropdown -->
          <div
            v-if="isNotificationsOpen"
            class="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden"
          >
            <div class="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 class="font-medium text-sm">Activity</h3>
              <span class="text-xs text-muted-foreground">Recent</span>
            </div>

            <div class="max-h-96 overflow-y-auto">
              <div
                v-if="activities.length === 0"
                class="p-8 text-center text-muted-foreground text-sm"
              >
                No recent activity
              </div>
              <div v-else class="divide-y divide-border">
                <div
                  v-for="item in activities"
                  :key="item.id"
                  class="p-3 hover:bg-muted/30 transition-colors flex gap-3"
                >
                  <!-- Icon based on action -->
                  <div class="mt-1">
                    <div
                      v-if="item.action === 'CREATE'"
                      class="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center"
                    >
                      <Plus class="w-4 h-4" />
                    </div>
                    <div
                      v-else-if="item.action === 'UPDATE'"
                      class="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center"
                    >
                      <Edit class="w-4 h-4" />
                    </div>
                    <div
                      v-else-if="item.action === 'DELETE'"
                      class="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center"
                    >
                      <Trash class="w-4 h-4" />
                    </div>
                    <div
                      v-else-if="item.action === 'COMPLETE'"
                      class="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center"
                    >
                      <CheckCircle class="w-4 h-4" />
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">
                      {{ item.resourceTitle || item.resourceType }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      <span class="capitalize">{{ item.action.toLowerCase() }}</span>
                      <span v-if="item.details"> • {{ item.details }}</span>
                    </p>
                    <p class="text-[10px] text-muted-foreground mt-1 text-right">
                      {{ formatActivityTime(item.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Profile -->
        <div ref="profileDropdownRef" class="relative">
          <button
            class="text-muted-foreground hover:text-foreground hover:bg-secondary p-2 rounded-md outline-none"
            @click="isProfileOpen = !isProfileOpen"
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
                @click="
                  () => {
                    isProfileOpen = false
                    router.push('/profile')
                  }
                "
              >
                <User class="w-4 h-4 text-muted-foreground" />
                Profile
              </button>
              <button
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-secondary transition-colors"
                @click="
                  () => {
                    isProfileOpen = false
                    router.push('/settings')
                  }
                "
              >
                <Settings class="w-4 h-4 text-muted-foreground" />
                Settings
              </button>
            </div>

            <div class="h-px bg-border mx-1"></div>

            <div class="p-1">
              <button
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                @click="handleLogout"
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
