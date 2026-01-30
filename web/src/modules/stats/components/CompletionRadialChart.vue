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

// Sort by value descending so largest values are on outer rings (if we map largest index -> largest radius)
// Or keep inner rings for high values?
// Let's stick to: Index 0 (Largest Value) -> Inner Ring. Index N -> Outer Ring.
// This prevents small high-value arcs being hidden behind large low-value arcs if overlapping (though here they are concentric/hollow so overlap isn't an issue).
// Standard rainbow chart usually has largest radius = largest item count or simply sorted.
// Let's keep the user's sort (descending value).
const sortedData = computed(() => [...props.data].sort((a, b) => b.value - a.value))

// Create concentric arcs (rainbow style - semi-circles)
const arcs = computed(() => {
  // Dynamic sizing based on data count to fit in view
  const count = sortedData.value.length
  // Available height ~ 130px (160 - 30 margin).
  // Base 30. Step X.
  // 30 + (count-1)*X <= 130  =>  (count-1)*X <= 100.
  // If count is large, reduce step.
  const baseRadius = 30
  const maxAvailableRadius = 130
  let radiusStep = 22

  if (count > 1) {
    const rawStep = (maxAvailableRadius - baseRadius) / (count - 1)
    radiusStep = Math.min(22, rawStep)
  }

  const arcWidth = Math.max(4, radiusStep - 4) // Keep gap
  const centerX = 200
  const centerY = 150

  return sortedData.value.map((item, index) => {
    // Reverse index for radius if we want largest Percentage on OUTSIDE
    // Usually visually: Big bar = Big success.
    // Let's put largest % on Outside (Largest Radius).
    // sortedData is Descending (Index 0 = Big Value).
    // So Index 0 -> Max Radius.
    // Index (count-1) -> Min Radius.
    const reverseIndex = count - 1 - index
    const radius = baseRadius + reverseIndex * radiusStep

    // OR if you prefer smallest ring = highest value ("Bullseye" effect).
    // Let's stick to the previous: Index 0 (High Val) -> Small Radius ("Bullseye").
    // const radius = baseRadius + index * radiusStep

    const percentage = Math.min(100, Math.max(0, item.value)) // Clamp 0-100
    const sweepAngle = (percentage / 100) * 180 // 180 degrees = 100%

    // Start at Left (180 deg), go Clockwise (Sweep 1) to Right (0 deg)
    const startRad = Math.PI // 180 deg
    const arcEndRad = Math.PI + (sweepAngle * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)

    const x2 = centerX + radius * Math.cos(arcEndRad)
    const y2 = centerY + radius * Math.sin(arcEndRad)

    // Background Arc (Full semi-circle PI to 2PI)
    const bgX2 = centerX + radius * Math.cos(2 * Math.PI)
    const bgY2 = centerY + radius * Math.sin(2 * Math.PI)

    // SVG Paths
    const coloredPath = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`
    const bgPath = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${bgX2} ${bgY2}`

    return {
      ...item,
      radius,
      coloredPath,
      bgPath,
      strokeWidth: arcWidth,
      percentage,
    }
  })
})

const hasData = computed(() => props.data.length > 0)
</script>

<template>
  <div class="flex flex-col items-center gap-6 lg:flex-row lg:justify-around text-foreground">
    <!-- Empty State -->
    <div v-if="!hasData" class="text-center py-10 text-muted-foreground">
      No completion data available
    </div>

    <template v-else>
      <!-- SVG Radial Chart -->
      <div class="relative">
        <svg width="400" height="160" viewBox="0 0 400 160">
          <!-- Background arcs (gray semi-circles) -->
          <path
            v-for="(arc, index) in arcs"
            :key="`bg-${index}`"
            :d="arc.bgPath"
            fill="none"
            stroke="currentColor"
            :stroke-width="arc.strokeWidth"
            class="text-muted/10"
            stroke-linecap="round"
          />

          <!-- Colored arcs (progress) -->
          <path
            v-for="(arc, index) in arcs"
            :key="`arc-${index}`"
            :d="arc.coloredPath"
            fill="none"
            :stroke="arc.color"
            :stroke-width="arc.strokeWidth"
            stroke-linecap="round"
            class="transition-all duration-700 ease-out"
            :style="{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }"
          />
        </svg>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap justify-center gap-3 lg:flex-col lg:gap-2">
        <div v-for="item in sortedData" :key="item.name" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-sm shrink-0" :style="{ backgroundColor: item.color }"></div>
          <span class="text-sm text-muted-foreground whitespace-nowrap">
            {{ item.name }}
          </span>
          <span class="text-sm font-bold"> {{ item.value }}% </span>
        </div>
      </div>
    </template>
  </div>
</template>
