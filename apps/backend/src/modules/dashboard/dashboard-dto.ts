export interface MediaCount {
  total: number;
  byStatus: {
    planned: number;
    ongoing: number;
    completed: number;
    dropped: number;
  };
}

export interface DashboardSummaryDTO {
  anime: MediaCount;
  manga: MediaCount;
  movies: MediaCount;
  tvSeries: MediaCount;
  fiction: MediaCount;
  nonFiction: MediaCount;
  games: MediaCount;
  totalItems: number;
}
