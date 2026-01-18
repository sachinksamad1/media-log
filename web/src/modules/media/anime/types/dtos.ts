export interface AnimeReleaseStatsDto {
  isCompleted: boolean;
  totalSeasons: number;
}

export interface AnimeUserStatsDto {
  score: number;
  status: 'Completed' | 'Planned' | 'Ongoing' | string;
}

export interface AnimeDto {
  id: string;
  title: string;
  genre: string[];
  origin: string;
  language: string;
  releaseStats: AnimeReleaseStatsDto;
  userStats: AnimeUserStatsDto;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnimeResponseDto {
  success: boolean;
  message: string;
  data: AnimeDto[];
  meta?: {
    totalItems?: number;
    nextCursor?: string | null;
    count?: number;
  };
}
