export type ReportMediaType =
  | 'anime'
  | 'manga'
  | 'fiction'
  | 'lightNovel'
  | 'nonFiction'
  | 'movie'
  | 'tvSeries'
  | 'game'
  | 'all'

export type ReportTimeRange =
  | 'all'
  | 'last7days'
  | 'last30days'
  | 'last90days'
  | 'thisYear'
  | 'custom'

export type ReportSortField = 'title' | 'score' | 'status' | 'createdAt' | 'updatedAt'

export type ReportSortOrder = 'asc' | 'desc'

export interface ReportFilters {
  mediaType: ReportMediaType
  status?: string
  timeRange?: ReportTimeRange
  startDate?: string
  endDate?: string
  minScore?: number
  maxScore?: number
  genres?: string[]
}

export interface ReportPagination {
  page: number
  limit: number
  sortBy: ReportSortField
  sortOrder: ReportSortOrder
}

export interface ReportItem {
  id: string
  mediaType: string
  title: string
  genres: string[]
  score: number
  status: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ReportSummary {
  totalItems: number
  byStatus: Record<string, number>
  byMediaType: Record<string, number>
  averageScore: number
  recentlyAdded: number
  recentlyUpdated: number
}

export interface ReportPaginationInfo {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasMore: boolean
}

export interface ReportResponse {
  items: ReportItem[]
  summary: ReportSummary
  pagination: ReportPaginationInfo
}

export interface ReportApiResponse {
  success: boolean
  data: ReportResponse
  message?: string
}

export interface ReportSummaryApiResponse {
  success: boolean
  data: ReportSummary
  message?: string
}

// Display configuration
export const MEDIA_TYPE_OPTIONS: { value: ReportMediaType; label: string }[] = [
  { value: 'all', label: 'All Media' },
  { value: 'anime', label: 'Anime' },
  { value: 'manga', label: 'Manga' },
  { value: 'fiction', label: 'Fiction' },
  { value: 'lightNovel', label: 'Light Novels' },
  { value: 'nonFiction', label: 'Non-Fiction' },
  { value: 'movie', label: 'Movies' },
  { value: 'tvSeries', label: 'TV Series' },
  { value: 'game', label: 'Games' },
]

export const TIME_RANGE_OPTIONS: { value: ReportTimeRange; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last90days', label: 'Last 90 Days' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
]

export const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Planned', label: 'Planned' },
  { value: 'Watching', label: 'Watching' },
  { value: 'Reading', label: 'Reading' },
  { value: 'Playing', label: 'Playing' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Dropped', label: 'Dropped' },
  { value: 'On-Hold', label: 'On-Hold' },
]

export const SORT_OPTIONS: { value: ReportSortField; label: string }[] = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'title', label: 'Title' },
  { value: 'score', label: 'Score' },
  { value: 'status', label: 'Status' },
]
