export interface LightNovelReleaseStatsDto {
  releaseStatus: 'Ongoing' | 'Completed' | 'Hiatus' | 'Cancelled' | string;
  volumes: number;
}

export interface LightNovelUserStatsDto {
  score: number;
  status: 'Completed' | 'Planned' | 'Ongoing' | string;
}

export interface LightNovelDto {
  id: string;
  title: string;
  author: string;
  illustrator: string;
  origin: string;
  genres: string[];
  type: 'Series' | 'Standalone' | string;
  format: 'Web Novel' | 'Light Novel' | 'Physical' | 'Digital' | string;
  releaseStats: LightNovelReleaseStatsDto;
  userStats: LightNovelUserStatsDto;
  readingStats?: { currentReadingVolume: number };
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LightNovelResponseDto {
  success: boolean;
  message: string;
  data: LightNovelDto[];
  meta?: {
    totalItems?: number;
    nextCursor?: string | null;
    count?: number;
  };
}
