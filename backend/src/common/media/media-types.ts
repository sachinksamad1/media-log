export type MediaStatus =
  | 'Planned'
  | 'Watching'
  | 'Reading'
  | 'Playing'
  | 'Ongoing'
  | 'Completed'
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
