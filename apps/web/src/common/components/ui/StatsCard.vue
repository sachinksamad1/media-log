<script setup lang="ts">
import { computed } from 'vue'
import { Tv, BookOpen, Gamepad2, Clock, CheckCircle, TrendingUp } from 'lucide-vue-next'
import { useLibraryStats } from '@common/composables/useLibraryStats'

const { watching, reading, playing, planned, completed, total } = useLibraryStats()

const stats = computed(() => [
  {
    label: 'Watching',
    value: watching.value,
    icon: Tv,
    bgColor: 'bg-[hsl(var(--category-anime)/10%)]',
    borderColor: 'border-[hsl(var(--category-anime)/20%)]',
    iconColor: 'text-[hsl(var(--category-anime))]',
  },
  {
    label: 'Reading',
    value: reading.value,
    icon: BookOpen,
    bgColor: 'bg-[hsl(var(--category-manga)/10%)]',
    borderColor: 'border-[hsl(var(--category-manga)/20%)]',
    iconColor: 'text-[hsl(var(--category-manga))]',
  },
  {
    label: 'Playing',
    value: playing.value,
    icon: Gamepad2,
    bgColor: 'bg-[hsl(var(--category-game)/10%)]',
    borderColor: 'border-[hsl(var(--category-game)/20%)]',
    iconColor: 'text-[hsl(var(--category-game))]',
  },
  {
    label: 'Planned',
    value: planned.value,
    icon: Clock,
    bgColor: 'bg-[hsl(var(--status-planned)/10%)]',
    borderColor: 'border-[hsl(var(--status-planned)/20%)]',
    iconColor: 'text-[hsl(var(--status-planned))]',
  },
  {
    label: 'Completed',
    value: completed.value,
    icon: CheckCircle,
    bgColor: 'bg-[hsl(var(--status-completed)/10%)]',
    borderColor: 'border-[hsl(var(--status-completed)/20%)]',
    iconColor: 'text-[hsl(var(--status-completed))]',
  },
  {
    label: 'Total Items',
    value: total.value,
    icon: TrendingUp,
    bgColor: 'bg-[hsl(var(--primary)/10%)]',
    borderColor: 'border-[hsl(var(--primary)/20%)]',
    iconColor: 'text-[hsl(var(--primary))]',
  },
])
</script>

<template>
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      :class="[stat.bgColor, stat.borderColor]"
    >
      <div class="flex items-center justify-between mb-3">
        <div
          class="p-2.5 rounded-xl bg-background/60 backdrop-blur-sm shadow-sm transition-colors group-hover:bg-background/80"
        >
          <component
            :is="stat.icon"
            class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            :class="stat.iconColor"
          />
        </div>
      </div>

      <div class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-wider opacity-60">
          {{ stat.label }}
        </p>
        <h3 class="text-2xl font-bold tracking-tight">
          {{ stat.value }}
        </h3>
      </div>
    </div>
  </div>
</template>
