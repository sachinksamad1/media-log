import type { MediaStatus } from '../media/media-types.js';

export interface SearchableMedia {
  id: string;
  title: string;
  imageUrl?: string;
  userStats?: {
    status: MediaStatus;
    score?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SearchableRepository<T extends SearchableMedia> {
  readonly collectionName: string;
  searchByTitle(
    query: string,
    userId: string,
    limitCount?: number,
  ): Promise<T[]>;
  getMediaType(): string;
}
