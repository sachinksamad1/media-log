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

// NonFiction
export interface NonFiction {
    id: string;
    title: string;
    author: string;
    illustrator: string;
    origin: string;
    genres: string[];
    type: 'Series' | 'Standalone' | string;
    format: 'Physical' | 'Digital' | 'Audiobook' | 'Hardcover' | 'Paperback' | string;    
    releaseStats: ReleaseStats;
    userStats: UserStats;
    readingStats?: { currentReadingVolume: number };
    imageUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

// NonFiction Response
export interface NonFictionResponse {
  success: boolean;
  message: string;
  data: NonFiction[];
  meta?: {
    totalItems?: number;
    nextCursor?: string | null;
    count?: number;
  };
}
