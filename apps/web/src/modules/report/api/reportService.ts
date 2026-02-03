import http from '@/common/api/http'
import type {
  ReportApiResponse,
  ReportFilters,
  ReportPagination,
  ReportSummaryApiResponse,
} from '../types/types'

function buildQueryParams(
  filters: Partial<ReportFilters>,
  pagination?: Partial<ReportPagination>
): URLSearchParams {
  const params = new URLSearchParams()

  // Filters
  if (filters.mediaType) params.set('mediaType', filters.mediaType)
  if (filters.status && filters.status !== 'All') params.set('status', filters.status)
  if (filters.timeRange && filters.timeRange !== 'all') params.set('timeRange', filters.timeRange)
  if (filters.startDate) params.set('startDate', filters.startDate)
  if (filters.endDate) params.set('endDate', filters.endDate)
  if (filters.minScore !== undefined) params.set('minScore', String(filters.minScore))
  if (filters.maxScore !== undefined) params.set('maxScore', String(filters.maxScore))
  if (filters.genres && filters.genres.length > 0) params.set('genres', filters.genres.join(','))

  // Pagination
  if (pagination) {
    if (pagination.page) params.set('page', String(pagination.page))
    if (pagination.limit) params.set('limit', String(pagination.limit))
    if (pagination.sortBy) params.set('sortBy', pagination.sortBy)
    if (pagination.sortOrder) params.set('sortOrder', pagination.sortOrder)
  }

  return params
}

export const reportService = {
  /**
   * Fetch paginated report data with filters
   */
  async getReport(
    filters: Partial<ReportFilters>,
    pagination?: Partial<ReportPagination>
  ): Promise<ReportApiResponse> {
    const params = buildQueryParams(filters, pagination)
    const response = await http.get<ReportApiResponse>(`/reports?${params.toString()}`)
    return response.data
  },

  /**
   * Fetch quick summary for the report page
   */
  async getSummary(): Promise<ReportSummaryApiResponse> {
    const response = await http.get<ReportSummaryApiResponse>('/reports/summary')
    return response.data
  },

  /**
   * Export report data and trigger download
   */
  async exportReport(
    filters: Partial<ReportFilters>,
    format: 'csv' | 'json' = 'csv'
  ): Promise<void> {
    const params = buildQueryParams(filters, {})
    params.set('format', format)

    const response = await http.get(`/reports/export?${params.toString()}`, {
      responseType: 'blob',
    })

    // Create download link
    const blob = new Blob([response.data as BlobPart], {
      type: format === 'csv' ? 'text/csv' : 'application/json',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    const timestamp = new Date().toISOString().split('T')[0]
    link.download = `media-report-${timestamp}.${format}`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
}
