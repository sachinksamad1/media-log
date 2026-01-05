export interface CreateFictionDto {
  title: string;
  author?: string;
  status?: string;
}

export interface UpdateFictionDto {
  title?: string;
  author?: string;
  status?: string;
}

export interface FictionResponseDto {
  id: string;
  title: string;
  author: string;
  published?: Date | string;
  genres: string[];
  origin?: string;
  language?: string;
  format: "E-Book" | "Physical";
  type: "Novel" | "Short Story";
  volumes: {
    order: number;
    total: number;
    isCompleted: boolean;
  }[];
  publicationStatus: "Completed" | "Ongoing" | "Hiatus";
  readingStatus: "Planned" | "Reading" | "Completed" | "Dropped";
  score: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
