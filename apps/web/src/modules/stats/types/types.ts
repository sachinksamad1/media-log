export interface MediaStats {
  total: number
  completed: number
  ongoing: number
  planned: number
}

export interface StatsSummary {
  // Summary cards data
  totalItems: number
  currentlyWatching: number
  inBacklog: number
  completed: number
  avgProgress: number
  completionRate: number

  // Media by category (for donut chart)
  byCategory: Record<string, number>

  // Media by status (for bar chart)
  byStatus: {
    ongoing: number
    planned: number
    completed: number
  }

  // Completion rate by category (for radial chart)
  completionByCategory: Record<string, number>

  // Detailed stats per category
  categoryStats: Record<string, MediaStats>
}

export interface StatsApiResponse {
  success: boolean
  data: StatsSummary
  message?: string
}

// Category display names and colors
export const CATEGORY_CONFIG: Record<string, { label: string; color: string; hslVar: string }> = {
  anime: { label: 'Anime', color: '#f472b6', hslVar: 'var(--category-anime)' },
  manga: { label: 'Manga', color: '#fb923c', hslVar: 'var(--category-manga)' },
  fiction: { label: 'Novels', color: '#4ade80', hslVar: 'var(--category-novel)' },
  lightNovel: { label: 'Light Novels', color: '#a78bfa', hslVar: 'var(--category-lightnovel)' },
  nonFiction: { label: 'Non-Fiction', color: '#60a5fa', hslVar: 'var(--category-nonfiction)' },
  movie: { label: 'Movies', color: '#f87171', hslVar: 'var(--category-movie)' },
  tvSeries: { label: 'TV Series', color: '#facc15', hslVar: 'var(--category-tvseries)' },
  game: { label: 'Games', color: '#2dd4bf', hslVar: 'var(--category-game)' },
}

export const STATUS_COLORS = {
  ongoing: '#22c55e',
  planned: '#3b82f6',
  completed: '#a855f7',
}
