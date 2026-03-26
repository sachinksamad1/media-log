<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  CheckCircle,
  PlusCircle,
  RefreshCw,
  Trash2,
  Shuffle,
  BarChart2,
  FileText,
  Sparkles,
} from 'lucide-vue-next'
import { useAuthStore } from '@/core/stores/useAuthStore'
import { useDashboardStore } from './store/dashboard.store'
import { formatDistanceToNow } from 'date-fns'
import StatView from './components/StatView.vue'
import StatsCard from '@/common/components/ui/StatsCard.vue'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchRecentActivities(3)
})

const displayName = computed(() => {
  return (
    authStore.userProfile?.displayName ||
    authStore.userProfile?.username ||
    authStore.user?.email?.split('@')[0] ||
    'User'
  )
})

const recentActivity = computed(() => {
  return dashboardStore.recentActivities.map((activity) => {
    let title = 'Activity'
    let icon = PlusCircle
    let iconColor = 'text-primary'
    let bgColor = 'bg-primary/10'

    switch (activity.action) {
      case 'CREATE':
        title = 'Added to library'
        icon = PlusCircle
        iconColor = 'text-blue-500'
        bgColor = 'bg-blue-500/10'
        break
      case 'UPDATE':
        title = 'Updated'
        icon = RefreshCw
        iconColor = 'text-primary'
        bgColor = 'bg-primary/10'
        break
      case 'DELETE':
        title = 'Removed'
        icon = Trash2
        iconColor = 'text-red-500'
        bgColor = 'bg-red-500/10'
        break
      case 'COMPLETE':
        title = 'Completed'
        icon = CheckCircle
        iconColor = 'text-green-500'
        bgColor = 'bg-green-500/10'
        break
    }

    return {
      title,
      subtitle: activity.resourceTitle || activity.resourceType,
      icon,
      time: formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true }),
      iconColor,
      bgColor,
    }
  })
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-lg text-muted-foreground">Welcome back,</h2>
      <h1 class="text-3xl font-bold">{{ displayName }}</h1>
    </div>

    <!-- Quick Actions -->
    <section>
      <h2 class="text-xl font-semibold mb-4 text-primary relative inline-block">
        Quick Actions
        <div class="absolute -bottom-1 left-0 w-1/3 h-1 bg-primary/30 rounded-full"></div>
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <router-link
          to="/random-pick"
          class="group relative flex flex-col items-center gap-3 p-6 rounded-3xl border bg-card hover:bg-primary/5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/20 overflow-hidden active:scale-95"
        >
          <div
            class="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500 ring-4 ring-transparent group-hover:ring-primary/5"
          >
            <Shuffle class="w-6 h-6" />
          </div>
          <span class="font-bold text-sm tracking-tight text-center">Random Pick</span>
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
        </router-link>

        <router-link
          to="/stats"
          class="group relative flex flex-col items-center gap-3 p-6 rounded-3xl border bg-card hover:bg-blue-500/5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-500/20 overflow-hidden active:scale-95"
        >
          <div
            class="p-4 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-500 ring-4 ring-transparent group-hover:ring-blue-500/5"
          >
            <BarChart2 class="w-6 h-6" />
          </div>
          <span class="font-bold text-sm tracking-tight text-center">Statistics</span>
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
        </router-link>

        <router-link
          to="/reports"
          class="group relative flex flex-col items-center gap-3 p-6 rounded-3xl border bg-card hover:bg-violet-500/5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-violet-500/20 overflow-hidden active:scale-95"
        >
          <div
            class="p-4 rounded-2xl bg-violet-500/10 text-violet-500 group-hover:scale-110 transition-transform duration-500 ring-4 ring-transparent group-hover:ring-violet-500/5"
          >
            <FileText class="w-6 h-6" />
          </div>
          <span class="font-bold text-sm tracking-tight text-center">Reports</span>
          <div
            class="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
        </router-link>

        <router-link
          to="/recommendations"
          class="group relative flex flex-col items-center gap-3 p-6 rounded-3xl border bg-card hover:bg-emerald-500/5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-emerald-500/20 overflow-hidden active:scale-95"
        >
          <div
            class="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-500 ring-4 ring-transparent group-hover:ring-emerald-500/5"
          >
            <Sparkles class="w-6 h-6" />
          </div>
          <span class="font-bold text-sm tracking-tight text-center">Recommendations</span>
          <div
            class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
        </router-link>
      </div>
    </section>

    <!-- Overview Stats -->
    <section>
      <h2 class="text-xl font-semibold mb-4 text-primary relative inline-block">
        Overview
        <div class="absolute -bottom-1 left-0 w-1/3 h-1 bg-primary/30 rounded-full"></div>
      </h2>
      <StatsCard />
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Recent Activity -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
        <div
          v-if="dashboardStore.loading && dashboardStore.recentActivities.length === 0"
          class="space-y-4"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="h-16 rounded-xl border animate-pulse bg-muted/50"
          ></div>
        </div>
        <div
          v-else-if="recentActivity.length === 0"
          class="text-center py-8 text-muted-foreground border rounded-xl border-dashed"
        >
          No recent activity found.
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="(activity, index) in recentActivity"
            :key="index"
            class="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
          >
            <div :class="['p-2.5 rounded-lg', activity.bgColor]">
              <component :is="activity.icon" class="w-5 h-5" :class="activity.iconColor" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-muted-foreground">{{ activity.title }}</p>
              <p class="font-medium truncate">{{ activity.subtitle }}</p>
            </div>
            <span class="text-xs text-muted-foreground whitespace-nowrap">{{ activity.time }}</span>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Quick Stats</h2>
        <StatView />
      </section>
    </div>
  </div>
</template>
