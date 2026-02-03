import { ref, computed, onMounted } from 'vue'
import { StatsService } from '@common/services/stats.service'
import type { StatsResponse, MediaStats } from '@common/types/stats'
import { ACTIVITY_GROUPS } from '@common/mappers/statsMapper'

export function useLibraryStats() {
  const statsResponse = ref<StatsResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchStats = async () => {
    try {
      loading.value = true
      error.value = null

      const res = await StatsService.getLibraryStats()

      if (!res.success || !res.data) {
        throw new Error('Invalid stats payload')
      }

      statsResponse.value = res
    } catch (e) {
      error.value = 'Failed to load library statistics'
      statsResponse.value = null
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchStats)

  /* ----------------------------------
     Safe aggregation layer
  ---------------------------------- */

  const allStats = computed<MediaStats[]>(() => {
    const data = statsResponse.value?.data

    if (!data || typeof data !== 'object') {
      return []
    }

    return Object.values(data)
  })

  // Helper to get ongoing count for specific media types
  const getOngoingByTypes = (types: readonly string[]) => {
    const data = statsResponse.value?.data
    if (!data) return 0
    return types.reduce((sum, type) => sum + (data[type]?.ongoing ?? 0), 0)
  }

  // Media-specific "ongoing" counts using mapper
  // These represent active consumption: Watching, Reading, Playing
  const watching = computed(() => getOngoingByTypes(ACTIVITY_GROUPS.watching))
  const reading = computed(() => getOngoingByTypes(ACTIVITY_GROUPS.reading))
  const playing = computed(() => getOngoingByTypes(ACTIVITY_GROUPS.playing))

  // Generic aggregates (kept for backward compatibility)
  const ongoing = computed(() => allStats.value.reduce((sum, m) => sum + m.ongoing, 0))
  const planned = computed(() => allStats.value.reduce((sum, m) => sum + m.planned, 0))
  const completed = computed(() => allStats.value.reduce((sum, m) => sum + m.completed, 0))
  const total = computed(() => allStats.value.reduce((sum, m) => sum + m.total, 0))

  // Per-category stats access
  const getCategoryStats = (mediaType: string): MediaStats | null => {
    return statsResponse.value?.data?.[mediaType] ?? null
  }

  return {
    loading,
    error,
    statsResponse,

    // Activity-based stats (Watching, Reading, Playing)
    watching,
    reading,
    playing,

    // Aggregated stats
    ongoing,
    planned,
    completed,
    total,

    // Utility functions
    getCategoryStats,
    refetch: fetchStats,
  }
}
