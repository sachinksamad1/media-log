<script setup lang="ts">
import { computed } from 'vue'
import {
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart2,
  Play,
  BookOpen,
  Gamepad2,
} from 'lucide-vue-next'
import { useLibraryStats } from '@common/composables/useLibraryStats'

const { watching, reading, playing, planned, completed, total, statsResponse } = useLibraryStats()

const stats = computed(() => [
  {
    label: 'Active',
    value: watching.value + reading.value + playing.value,
    icon: TrendingUp,
    color: 'text-primary',
  },
  { label: 'Planned', value: planned.value, icon: Clock, color: 'text-blue-500' },
  { label: 'Done', value: completed.value, icon: CheckCircle, color: 'text-green-500' },
  { label: 'Total', value: total.value, icon: BarChart2, color: 'text-violet-500' },
])

const categoryData = computed(() => {
  const data = statsResponse.value?.data
  if (!data) return []
  return Object.entries(data)
    .map(([key, stats]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: stats.total,
      color: getCategoryColor(key),
      icon: getCategoryIcon(key),
    }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
})

function getCategoryColor(key: string) {
  const colors: Record<string, string> = {
    anime: '#22c55e',
    manga: '#f59e0b',
    game: '#8b5cf6',
    movie: '#ef4444',
    tvSeries: '#3b82f6',
    fiction: '#ec4899',
    nonFiction: '#14b8a6',
    lightNovel: '#f97316',
  }
  return colors[key] || '#888'
}

function getCategoryIcon(key: string) {
  const icons: Record<string, typeof Play> = {
    anime: Play,
    manga: BookOpen,
    game: Gamepad2,
  }
  return icons[key] || BarChart2
}

const pieSegments = computed(() => {
  const totalVal = categoryData.value.reduce((sum, c) => sum + c.value, 0)
  if (totalVal === 0) return []

  let currentAngle = 0
  const radius = 40
  const centerX = 50
  const centerY = 50

  return categoryData.value.map((item) => {
    const percentage = (item.value / totalVal) * 100
    const angle = (percentage / 100) * 360

    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0
    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

    return { ...item, percentage, path }
  })
})
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
      >
        <div class="p-2 rounded-lg bg-muted/50">
          <component :is="stat.icon" class="w-4 h-4" :class="stat.color" />
        </div>
        <div>
          <p class="text-lg font-bold">{{ stat.value }}</p>
          <p class="text-xs text-muted-foreground">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <div v-if="pieSegments.length > 0" class="p-4 rounded-xl border bg-card">
      <h3 class="text-sm font-medium mb-3 text-muted-foreground">Distribution</h3>
      <div class="flex items-center gap-4">
        <svg width="100" height="100" viewBox="0 0 100 100" class="flex-shrink-0">
          <g v-for="(seg, i) in pieSegments" :key="i">
            <path :d="seg.path" :fill="seg.color" class="transition-opacity hover:opacity-80" />
          </g>
          <circle cx="50" cy="50" r="20" fill="currentColor" class="fill-background" />
        </svg>
        <div class="flex flex-wrap gap-2">
          <div v-for="seg in pieSegments" :key="seg.name" class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-sm" :style="{ backgroundColor: seg.color }"></div>
            <span class="text-xs text-muted-foreground">{{ seg.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
