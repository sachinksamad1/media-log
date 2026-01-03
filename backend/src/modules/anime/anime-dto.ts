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