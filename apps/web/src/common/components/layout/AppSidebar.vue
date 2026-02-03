<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  LayoutDashboard,
  Tv,
  BookOpen,
  Book,
  BookText,
  GraduationCap,
  Film,
  BarChart3,
  Settings,
  ChevronLeft,
  X,
  Gamepad2,
  MonitorPlay,
  NotebookText,
} from 'lucide-vue-next'

const open = defineModel<boolean>('open')
const collapsed = defineModel<boolean>('collapsed')

const onClose = () => {
  open.value = false
}

const onToggleCollapse = () => {
  collapsed.value = !collapsed.value
}

const route = useRoute()
const currentPath = computed(() => route.path)

const isActive = (href: string) => {
  if (href === '/') return currentPath.value === '/'
  return currentPath.value.startsWith(href)
}

const navigationItems = [{ icon: LayoutDashboard, label: 'Dashboard', href: '/' }]

const categoryItems = [
  { icon: Tv, label: 'Anime', href: '/anime', color: 'text-[hsl(var(--category-anime))]' },
  { icon: BookOpen, label: 'Manga', href: '/manga', color: 'text-[hsl(var(--category-manga))]' },
  {
    icon: BookText,
    label: 'Light Novels',
    href: '/light-novel',
    color: 'text-[hsl(var(--category-lightnovel))]',
  },
  { icon: Book, label: 'Fiction', href: '/fiction', color: 'text-[hsl(var(--category-fiction))]' },
  {
    icon: GraduationCap,
    label: 'Non-Fiction',
    href: '/non-fiction',
    color: 'text-[hsl(var(--category-nonfiction))]',
  },
  { icon: Film, label: 'Movies', href: '/movie', color: 'text-[hsl(var(--category-movie))]' },
  {
    icon: MonitorPlay,
    label: 'TV Series',
    href: '/tv-series',
    color: 'text-[hsl(var(--category-tvseries))]',
  },
  { icon: Gamepad2, label: 'Games', href: '/game', color: 'text-[hsl(var(--category-game))]' },
]

const bottomItems = [
  { icon: BarChart3, label: 'Stats', href: '/stats' },
  { icon: NotebookText, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]
</script>

<template>
  <!-- Mobile overlay -->
  <div
    v-if="open"
    class="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
    @click="onClose"
  />

  <!-- Sidebar -->
  <aside
    class="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-sidebar border-t-0 border border-border z-40 transition-all duration-300 ease-in-out flex flex-col w-50 lg:translate-x-0"
    :class="[open ? 'translate-x-0' : '-translate-x-full', collapsed ? 'lg:w-16' : 'lg:w-50']"
  >
    <!-- Mobile close -->
    <div class="flex items-center justify-between p-4 lg:hidden">
      <span class="font-display font-semibold text-foreground">Menu</span>
      <button class="p-2 rounded-md hover:bg-secondary" @click="onClose">
        <X class="h-5 w-5" />
      </button>
    </div>

    <!-- Collapse toggle -->
    <div class="hidden lg:flex items-center justify-end p-2">
      <button
        class="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
        @click="onToggleCollapse"
      >
        <ChevronLeft
          class="h-4 w-4 transition-transform duration-300"
          :class="collapsed && 'rotate-180'"
        />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
      <!-- Main -->
      <div class="space-y-1">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth"
          :class="
            isActive(item.href)
              ? 'bg-primary/10 text-secondary'
              : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent'
          "
          @click="onClose"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span v-if="!collapsed" class="text-sm font-medium">
            {{ item.label }}
          </span>
        </RouterLink>
      </div>

      <!-- Categories -->
      <div class="space-y-1">
        <span
          v-if="!collapsed"
          class="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Categories
        </span>

        <div class="space-y-1 mt-2">
          <RouterLink
            v-for="item in categoryItems"
            :key="item.href"
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth"
            :class="
              isActive(item.href)
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent'
            "
            @click="onClose"
          >
            <component :is="item.icon" class="h-5 w-5 shrink-0" :class="item.color" />
            <span v-if="!collapsed" class="text-sm font-medium">
              {{ item.label }}
            </span>
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Bottom -->
    <div class="px-3 py-4 border-t border-border border space-y-1">
      <RouterLink
        v-for="item in bottomItems"
        :key="item.href"
        :to="item.href"
        class="flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth"
        :class="
          isActive(item.href)
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent'
        "
        @click="onClose"
      >
        <component :is="item.icon" class="h-5 w-5 shrink-0" />
        <span v-if="!collapsed" class="text-sm font-medium">
          {{ item.label }}
        </span>
      </RouterLink>
    </div>
  </aside>
</template>
