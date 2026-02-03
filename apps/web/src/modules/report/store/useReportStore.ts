import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { reportService } from '../api/reportService'
import type {
  ReportFilters,
  ReportPagination,
  ReportItem,
  ReportSummary,
  ReportPaginationInfo,
  ReportMediaType,
  ReportTimeRange,
  ReportSortField,
  ReportSortOrder,
} from '../types/types'

export const useReportStore = defineStore('report', () => {
  // State
  const items = ref<ReportItem[]>([])
  const summary = ref<ReportSummary | null>(null)
  const paginationInfo = ref<ReportPaginationInfo | null>(null)
  const isLoading = ref(false)
  const isExporting = ref(false)
  const error = ref<string | null>(null)

  // Filters state
  const filters = ref<ReportFilters>({
    mediaType: 'all',
    status: 'All',
    timeRange: 'all',
  })

  // Pagination state
  const pagination = ref<ReportPagination>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  // Computed
  const hasItems = computed(() => items.value.length > 0)
  const totalItems = computed(() => paginationInfo.value?.totalItems ?? 0)
  const totalPages = computed(() => paginationInfo.value?.totalPages ?? 0)
  const hasMore = computed(() => paginationInfo.value?.hasMore ?? false)
  const currentPage = computed(() => pagination.value.page)

  // Actions
  async function fetchReport() {
    isLoading.value = true
    error.value = null

    try {
      const response = await reportService.getReport(filters.value, pagination.value)
      items.value = response.data.items
      summary.value = response.data.summary
      paginationInfo.value = response.data.pagination
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch report'
      console.error('Error fetching report:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function exportReport(format: 'csv' | 'json' = 'csv') {
    isExporting.value = true
    error.value = null

    try {
      await reportService.exportReport(filters.value, format)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to export report'
      console.error('Error exporting report:', err)
    } finally {
      isExporting.value = false
    }
  }

  function setMediaType(mediaType: ReportMediaType) {
    filters.value.mediaType = mediaType
    pagination.value.page = 1
    fetchReport()
  }

  function setStatus(status: string) {
    filters.value.status = status
    pagination.value.page = 1
    fetchReport()
  }

  function setTimeRange(timeRange: ReportTimeRange) {
    filters.value.timeRange = timeRange
    pagination.value.page = 1
    fetchReport()
  }

  function setCustomDateRange(startDate: string, endDate: string) {
    filters.value.timeRange = 'custom'
    filters.value.startDate = startDate
    filters.value.endDate = endDate
    pagination.value.page = 1
    fetchReport()
  }

  function setSort(sortBy: ReportSortField, sortOrder?: ReportSortOrder) {
    pagination.value.sortBy = sortBy
    if (sortOrder) {
      pagination.value.sortOrder = sortOrder
    } else {
      // Toggle order if same field
      pagination.value.sortOrder = pagination.value.sortOrder === 'asc' ? 'desc' : 'asc'
    }
    fetchReport()
  }

  function setPage(page: number) {
    pagination.value.page = page
    fetchReport()
  }

  function nextPage() {
    if (hasMore.value) {
      pagination.value.page++
      fetchReport()
    }
  }

  function prevPage() {
    if (pagination.value.page > 1) {
      pagination.value.page--
      fetchReport()
    }
  }

  function resetFilters() {
    filters.value = {
      mediaType: 'all',
      status: 'All',
      timeRange: 'all',
    }
    pagination.value = {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }
    fetchReport()
  }

  return {
    // State
    items,
    summary,
    paginationInfo,
    isLoading,
    isExporting,
    error,
    filters,
    pagination,

    // Computed
    hasItems,
    totalItems,
    totalPages,
    hasMore,
    currentPage,

    // Actions
    fetchReport,
    exportReport,
    setMediaType,
    setStatus,
    setTimeRange,
    setCustomDateRange,
    setSort,
    setPage,
    nextPage,
    prevPage,
    resetFilters,
  }
})
