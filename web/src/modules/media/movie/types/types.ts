export interface MovieUserStats {
    score: number;
    status: 'Completed' | 'Plan to Watch' | 'Watching' | 'Dropped' | string;
    watchedDate?: string;
    rewatchCount?: number;
}

export interface Movie {
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
    userStats: MovieUserStats;
    imageUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface MovieResponse {
  success: boolean;
  message: string;
  data: Movie[];
  meta?: {
    totalItems?: number;
    nextCursor?: string | null;
    count?: number;
  };
}
