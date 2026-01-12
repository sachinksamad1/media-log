export type MediaStatus =
  | 'Completed'
  | 'Ongoing'
  | 'Planned'
  | 'Watching'
  | 'Dropped'
  | 'On-Hold';

export interface BaseMediaType {
  id?: string;
  title: string;
  imageUrl?: string;
  userStats?: {
    status: MediaStatus;
  };
  createdAt?: Date;
  updatedAt?: Date;
}