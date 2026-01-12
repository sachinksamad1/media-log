import { ref, computed, onMounted } from "vue"
import { StatsService } from "../services/stats.service"
import type { StatsResponse, MediaStats } from "../types/stats"

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
        throw new Error("Invalid stats payload")
      }

      statsResponse.value = res
    } catch (e) {
      error.value = "Failed to load library statistics"
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

    if (!data || typeof data !== "object") {
      return []
    }

    return Object.values(data)
  })

  const ongoing = computed(() =>
    allStats.value.reduce((sum, m) => sum + m.ongoing, 0)
  )

  const planned = computed(() =>
    allStats.value.reduce((sum, m) => sum + m.planned, 0)
  )

  const completed = computed(() =>
    allStats.value.reduce((sum, m) => sum + m.completed, 0)
  )

  const total = computed(() =>
    allStats.value.reduce((sum, m) => sum + m.total, 0)
  )

  return {
    loading,
    error,
    statsResponse,

    ongoing,
    planned,
    completed,
    total,

    refetch: fetchStats
  }
}