import { ref, computed, onMounted } from 'vue'
import { statsService } from '../api/statsService'
import type { StatsSummary } from '../types/types'

export function useStats() {
  const stats = ref<StatsSummary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchStats = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await statsService.getSummary()

      if (!response.success || !response.data) {
        throw new Error('Failed to fetch stats')
      }

      stats.value = response.data
    } catch (e) {
      error.value = 'Failed to load statistics'
      stats.value = null
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchStats)

  // Computed helpers
  const summaryCards = computed(() => {
    if (!stats.value) return []
    return [
      {
        label: 'Total Items',
        value: stats.value.totalItems,
        type: 'total',
      },
      {
        label: 'Ongoing',
        value: stats.value.currentlyWatching,
        type: 'ongoing',
      },
      {
        label: 'Planned',
        value: stats.value.inBacklog,
        type: 'planned',
      },
      {
        label: 'Completed',
        value: stats.value.completed,
        type: 'completed',
      },
      {
        label: 'Avg Progress',
        value: `${stats.value.avgProgress}%`,
        type: 'progress',
      },
      {
        label: 'Completion Rate',
        value: `${stats.value.completionRate}%`,
        type: 'rate',
      },
    ]
  })

  const categoryData = computed(() => {
    if (!stats.value) return []
    return Object.entries(stats.value.byCategory)
      .filter(([, count]) => count > 0)
      .map(([key, count]) => ({ key, count }))
  })

  const statusData = computed(() => {
    if (!stats.value) return { ongoing: 0, planned: 0, completed: 0 }
    return stats.value.byStatus
  })

  const completionData = computed(() => {
    if (!stats.value) return []
    return Object.entries(stats.value.completionByCategory)
      .filter(([key]) => (stats.value?.byCategory[key] ?? 0) > 0)
      .map(([key, rate]) => ({ key, rate }))
  })

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    summaryCards,
    categoryData,
    statusData,
    completionData,
  }
}
