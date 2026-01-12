export interface MediaSummary {
  total: number;
  completed: number;
  watching: number;
  planned: number;
}

export interface DashboardStats {
  anime: MediaSummary;
  manga: MediaSummary;
  games: MediaSummary;
}
