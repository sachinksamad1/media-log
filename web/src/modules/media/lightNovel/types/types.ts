// Release Stats
export interface ReleaseStats {
    releaseStatus: 'Ongoing' | 'Completed' | 'Hiatus' | 'Cancelled' | string;
    volumes: number;
}

// User Stats
export interface UserStats {
    score: number;
    status: 'Completed' | 'Planned' | 'Ongoing' | string;
}

// LightNovel
export interface LightNovel {
    id: string;
    title: string;
    author: string;
    illustrator: string;
    origin: string;
    genres: string[];
    type: 'Series' | 'Standalone' | string;
    format: 'Web Novel' | 'Light Novel' | 'Physical' | 'Digital' | string;    
    releaseStats: ReleaseStats;
    userStats: UserStats;
    readingStats?: { currentReadingVolume: number };
    imageUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

// LightNovel Response
export interface LightNovelResponse {
  success: boolean;
  message: string;
  data: LightNovel[];
  meta?: {
    totalItems?: number;
    nextCursor?: string | null;
    count?: number;
  };
}