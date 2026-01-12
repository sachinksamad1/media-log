// Release Stats 
export interface ReleaseStats {
  isCompleted: boolean;
  totalSeasons: number;
}

// User Stats
export interface UserStats {
  score: number;
  status: 'Completed' | 'Planned' | 'Ongoing' | string;
}

// Anime Schema
export interface Anime {
  id: string;
  title: string;
  genre: string[];
  origin: string;
  language: string;
  releaseStats: ReleaseStats;
  userStats: UserStats;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Anime Response 
export interface AnimeResponse {
  success: boolean;
  message: string;
  data: Anime[];
}

