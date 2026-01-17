// Release Stats
export interface ReleaseStats {
  chapterPublished: number;
  volumePublished: number;
  releaseStatus: 'Ongoing' | 'Completed' | 'Hiatus' | 'Cancelled' | string;
}

// User Stats
export interface UserStats {
  score: number;
  status: 'Completed' | 'Planned' | 'Ongoing' | string;
}

// Manga Schmea
export interface Manga {
  id: string;
  title: string;
  author: string;
  illustrator: string;
  origin: string;
  genres: string[];
  type: 'Manga' | 'Manhwa' | 'Manhua' | 'One-shot' | 'Doujinshi' | string;
  format: 'Physical' | 'Digital' | 'Magazine' | string;
  releaseStats: ReleaseStats;
  userStats: UserStats;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Manga Response
export interface MangaResponse {
  success: boolean;
  message: string;
  data: Manga[];
  meta?: {
    totalItems: number;
    nextCursor: string | null;
    count?: number;
  }
}

