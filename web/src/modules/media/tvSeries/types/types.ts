export interface TvSeriesUserStats {
    score: number;
    status: 'Completed' | 'Plan to Watch' | 'Watching' | 'Dropped' | 'On Hold' | string;
    watchedEpisodes: number;
    rewatchCount?: number;
}

export interface TvSeries {
    id: string;
    title: string;
    director: string;
    producer: string;
    studio: string;
    network: string;
    cast: string[];
    genres: string[];
    releaseDate?: string;
    endDate?: string;
    episodes?: number;
    language: string;
    country: string;
    userStats: TvSeriesUserStats;
    imageUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TvSeriesResponse {
  success: boolean;
  message: string;
  data: TvSeries[];
  meta?: {
    totalItems?: number;
    nextCursor?: string | null;
    count?: number;
  };
}
