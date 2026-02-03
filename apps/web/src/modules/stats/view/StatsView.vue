<script setup lang="ts">
import { computed } from 'vue'
import { Library, Play, Clock, CheckCircle, TrendingUp, Target } from 'lucide-vue-next'
import { useStats } from '../store/useStats'
import { CATEGORY_CONFIG, STATUS_COLORS } from '../types/types'
import CategoryDonutChart from '../components/CategoryDonutChart.vue'
import StatusBarChart from '../components/StatusBarChart.vue'
import CompletionRadialChart from '../components/CompletionRadialChart.vue'

const { loading, error, summaryCards, categoryData, statusData, completionData, refetch } =
  useStats()

const cardIcons: Record<string, typeof Library> = {
  total: Library,
  ongoing: Play,
  planned: Clock,
  completed: CheckCircle,
  progress: TrendingUp,
  rate: Target,
}

const cardStyles: Record<string, { bg: string; border: string; icon: string }> = {
  total: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    icon: 'text-primary',
  },
  ongoing: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-500',
  },
  planned: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-500',
  },
  completed: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    icon: 'text-violet-500',
  },
  progress: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'text-amber-500',
  },
  rate: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    icon: 'text-rose-500',
  },
}

const categoryChartData = computed(() =>
  categoryData.value.map((item) => ({
    name: CATEGORY_CONFIG[item.key]?.label ?? item.key,
    value: item.count,
    color: CATEGORY_CONFIG[item.key]?.color ?? '#888',
  }))
)

const completionChartData = computed(() =>
  completionData.value.map((item) => ({
    name: CATEGORY_CONFIG[item.key]?.label ?? item.key,
    value: item.rate,
    color: CATEGORY_CONFIG[item.key]?.color ?? '#888',
  }))
)
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold">Statistics</h1>
      <p class="text-muted-foreground mt-1">Track your media consumption and progress</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-20 text-muted-foreground"
    >
      <p class="text-lg mb-4">{{ error }}</p>
      <button
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        @click="refetch"
      >
        Try Again
      </button>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <div
          v-for="card in summaryCards"
          :key="card.label"
          class="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          :class="[cardStyles[card.type]?.bg, cardStyles[card.type]?.border]"
        >
          <div class="flex items-center justify-between mb-3">
            <div
              class="p-2.5 rounded-xl bg-background/60 backdrop-blur-sm shadow-sm transition-colors group-hover:bg-background/80"
            >
              <component
                :is="cardIcons[card.type]"
                class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                :class="cardStyles[card.type]?.icon"
              />
            </div>
          </div>

          <div class="space-y-1">
            <h3 class="text-2xl font-bold tracking-tight">
              {{ card.value }}
            </h3>
            <p class="text-xs font-semibold uppercase tracking-wider opacity-60">
              {{ card.label }}
            </p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Media by Category (Donut) -->
        <div class="rounded-2xl border border-border bg-card p-6">
          <h2 class="text-lg font-semibold mb-4">Media by Category</h2>
          <CategoryDonutChart :data="categoryChartData" />
        </div>

        <!-- Media by Status (Bar) -->
        <div class="rounded-2xl border border-border bg-card p-6">
          <h2 class="text-lg font-semibold mb-4">Media by Status</h2>
          <StatusBarChart :data="statusData" :colors="STATUS_COLORS" />
        </div>
      </div>

      <!-- Completion Rate by Category -->
      <div class="rounded-2xl border border-border bg-card p-6">
        <h2 class="text-lg font-semibold mb-4">Completion Rate by Category</h2>
        <CompletionRadialChart :data="completionChartData" />
      </div>
    </template>
  </div>
</template>
