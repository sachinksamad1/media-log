export interface GameUserStats {
    score: number;
    status: 'Completed' | 'Playing' | 'Planned' | 'Dropped' | string;
    playTime?: number; // Hours
}

export interface Game {
    id: string;
    title: string;
    developer: string;
    publisher: string;
    platforms: string[];
    genres: string[];
    releaseDate?: string;
    userStats: GameUserStats;
    imageUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface GameResponse {
  success: boolean;
  message: string;
  data: Game[];
  meta?: {
    totalItems?: number;
    nextCursor?: string | null;
    count?: number;
  };
}
