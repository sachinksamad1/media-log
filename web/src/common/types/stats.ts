export type MediaStats = {
  total: number
  completed: number
  ongoing: number
  planned: number
}

export type StatsResponse = {
  success: boolean
  data: Record<string, MediaStats>
}