export interface MovieUserStatsDto {
  score: number;
  status: 'Completed' | 'Plan to Watch' | 'Watching' | 'Dropped' | string;
  watchedDate?: string;
  rewatchCount?: number;
}

export interface MovieDto {
  id: string;
  title: string;
  director: string;
  producer: string;
  studio: string;
  cast: string[];
  genres: string[];
  releaseDate?: string;
  duration?: number; // In minutes
  language: string;
  country: string;
  userStats: MovieUserStatsDto;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MovieResponseDto {
  success: boolean;
  message: string;
  data: MovieDto[];
  meta?: {
    totalItems?: number;
    nextCursor?: string | null;
    count?: number;
  };
}
