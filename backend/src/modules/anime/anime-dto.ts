export interface CreateAnimeDto {
  title: string;
  episodes?: number;
  status?: string;
}

export interface UpdateAnimeDto {
  title?: string;
  score?: number;
  // ... add partial fields
}

export interface AnimeResponseDto {
  id: string;
  title: string;
  genre: string[];
  origin: string;
  language: string;
  animeStats: {
    currentSeason: number;
    totalSeasons: number;
    isCompleted: boolean;
  };
  userStats: {
    score: number;
    status: "Planned" | "Watching" | "Completed" | "Dropped" | "On-Hold";
  };
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
