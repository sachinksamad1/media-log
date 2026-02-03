<script setup lang="ts">
import { computed } from 'vue'

interface ChartDataItem {
  name: string
  value: number
  color: string
}

const props = defineProps<{
  data: ChartDataItem[]
}>()

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

const segments = computed(() => {
  let currentAngle = 0
  const gap = 2 // degrees between segments

  return props.data.map((item) => {
    const percentage = total.value > 0 ? (item.value / total.value) * 100 : 0
    const angle = (percentage / 100) * 360 - gap

    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    currentAngle = endAngle + gap

    // Calculate SVG arc path
    const innerRadius = 60
    const outerRadius = 100
    const centerX = 120
    const centerY = 120

    const startAngleRad = ((startAngle - 90) * Math.PI) / 180
    const endAngleRad = ((endAngle - 90) * Math.PI) / 180

    const x1 = centerX + outerRadius * Math.cos(startAngleRad)
    const y1 = centerY + outerRadius * Math.sin(startAngleRad)
    const x2 = centerX + outerRadius * Math.cos(endAngleRad)
    const y2 = centerY + outerRadius * Math.sin(endAngleRad)
    const x3 = centerX + innerRadius * Math.cos(endAngleRad)
    const y3 = centerY + innerRadius * Math.sin(endAngleRad)
    const x4 = centerX + innerRadius * Math.cos(startAngleRad)
    const y4 = centerY + innerRadius * Math.sin(startAngleRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    const path = `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `

    return {
      ...item,
      percentage,
      path,
    }
  })
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 lg:flex-row lg:justify-around">
    <!-- SVG Donut Chart -->
    <div class="relative">
      <svg width="240" height="240" viewBox="0 0 240 240">
        <g v-for="(segment, index) in segments" :key="index">
          <path
            :d="segment.path"
            :fill="segment.color"
            class="transition-all duration-300 hover:opacity-80 cursor-pointer"
            :style="{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }"
          />
        </g>
        <!-- Center text -->
        <!-- Center text -->
        <text
          x="120"
          y="115"
          text-anchor="middle"
          fill="currentColor"
          class="text-foreground text-3xl font-bold"
        >
          {{ total }}
        </text>
        <text
          x="120"
          y="135"
          text-anchor="middle"
          fill="currentColor"
          class="text-muted-foreground text-xs"
        >
          Total
        </text>
      </svg>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap justify-center gap-4 lg:flex-col lg:gap-2">
      <div v-for="item in segments" :key="item.name" class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-sm" :style="{ backgroundColor: item.color }"></div>
        <span class="text-sm text-muted-foreground">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
