export type MediaStatus = 'planned' | 'watching' | 'completed' | 'dropped';

export interface BaseMedia {
  id: string;
  title: string;
  status: MediaStatus;
  rating?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}