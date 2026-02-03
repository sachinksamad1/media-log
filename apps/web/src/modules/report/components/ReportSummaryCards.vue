<script setup lang="ts">
import { computed } from 'vue'
import { Library, TrendingUp, Clock, Star, Plus, RefreshCw } from 'lucide-vue-next'
import type { ReportSummary } from '../types/types'

interface Props {
  summary: ReportSummary
}

const props = defineProps<Props>()

const cards = computed(() => [
  {
    label: 'Total Items',
    value: props.summary.totalItems,
    icon: Library,
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    iconColor: 'text-primary',
  },
  {
    label: 'Average Score',
    value: props.summary.averageScore > 0 ? `${props.summary.averageScore}/10` : 'N/A',
    icon: Star,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-500',
  },
  {
    label: 'Recently Added',
    value: props.summary.recentlyAdded,
    description: 'Last 7 days',
    icon: Plus,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-500',
  },
  {
    label: 'Recently Updated',
    value: props.summary.recentlyUpdated,
    description: 'Last 7 days',
    icon: RefreshCw,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-500',
  },
])

const statusBreakdown = computed(() => {
  const entries = Object.entries(props.summary.byStatus)
  return entries.sort((a, b) => b[1] - a[1]).slice(0, 5)
})

const mediaTypeBreakdown = computed(() => {
  const entries = Object.entries(props.summary.byMediaType)
  return entries.sort((a, b) => b[1] - a[1]).slice(0, 5)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Summary Cards -->
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div
        v-for="card in cards"
        :key="card.label"
        class="group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        :class="[card.bg, card.border]"
      >
        <div class="flex items-center justify-between mb-2">
          <div
            class="p-2 rounded-xl bg-background/60 backdrop-blur-sm shadow-sm transition-colors group-hover:bg-background/80"
          >
            <component
              :is="card.icon"
              class="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
              :class="card.iconColor"
            />
          </div>
        </div>

        <div class="space-y-0.5">
          <h3 class="text-xl font-bold tracking-tight">{{ card.value }}</h3>
          <p class="text-xs font-medium uppercase tracking-wider opacity-60">{{ card.label }}</p>
          <p v-if="card.description" class="text-xs text-muted-foreground">
            {{ card.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Breakdown Charts -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Status Breakdown -->
      <div class="rounded-xl border border-border bg-card p-4">
        <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
          <TrendingUp class="w-4 h-4 text-primary" />
          By Status
        </h3>
        <div class="space-y-2">
          <div
            v-for="[status, count] in statusBreakdown"
            :key="status"
            class="flex items-center justify-between text-sm"
          >
            <span class="text-muted-foreground">{{ status }}</span>
            <div class="flex items-center gap-2">
              <div class="w-20 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  class="h-full bg-primary rounded-full transition-all"
                  :style="{ width: `${(count / summary.totalItems) * 100}%` }"
                />
              </div>
              <span class="font-medium w-8 text-right">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Media Type Breakdown -->
      <div class="rounded-xl border border-border bg-card p-4">
        <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
          <Clock class="w-4 h-4 text-primary" />
          By Media Type
        </h3>
        <div class="space-y-2">
          <div
            v-for="[type, count] in mediaTypeBreakdown"
            :key="type"
            class="flex items-center justify-between text-sm"
          >
            <span class="text-muted-foreground">{{ type }}</span>
            <div class="flex items-center gap-2">
              <div class="w-20 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  class="h-full bg-accent-foreground/50 rounded-full transition-all"
                  :style="{ width: `${(count / summary.totalItems) * 100}%` }"
                />
              </div>
              <span class="font-medium w-8 text-right">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
