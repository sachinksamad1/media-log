<script setup lang="ts">
import { computed } from 'vue'

interface StatusData {
  ongoing: number
  planned: number
  completed: number
}

interface StatusColors {
  ongoing: string
  planned: string
  completed: string
}

const props = defineProps<{
  data: StatusData
  colors: StatusColors
}>()

const maxValue = computed(() =>
  Math.max(props.data.ongoing, props.data.planned, props.data.completed, 1)
)

const bars = computed(() => [
  {
    label: 'Ongoing',
    value: props.data.ongoing,
    color: props.colors.ongoing,
    width: (props.data.ongoing / maxValue.value) * 100,
  },
  {
    label: 'Planned',
    value: props.data.planned,
    color: props.colors.planned,
    width: (props.data.planned / maxValue.value) * 100,
  },
  {
    label: 'Completed',
    value: props.data.completed,
    color: props.colors.completed,
    width: (props.data.completed / maxValue.value) * 100,
  },
])
</script>

<template>
  <div class="space-y-4">
    <div v-for="bar in bars" :key="bar.label" class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">{{ bar.label }}</span>
        <span class="font-medium">{{ bar.value }}</span>
      </div>
      <div class="h-8 bg-muted/30 rounded-lg overflow-hidden relative">
        <div
          class="h-full rounded-lg transition-all duration-500 ease-out"
          :style="{
            width: `${bar.width}%`,
            backgroundColor: bar.color,
            minWidth: bar.value > 0 ? '2rem' : '0',
          }"
        ></div>
      </div>
    </div>

    <!-- Scale markers -->
    <div class="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
      <span>0</span>
      <span>{{ Math.ceil(maxValue / 4) }}</span>
      <span>{{ Math.ceil(maxValue / 2) }}</span>
      <span>{{ Math.ceil((maxValue * 3) / 4) }}</span>
      <span>{{ maxValue }}</span>
    </div>
  </div>
</template>
