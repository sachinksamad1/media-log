// src/features/anime/types.ts
import { BaseMedia } from '@/types/media';

export interface Anime extends BaseMedia {
  totalEpisodes: number;
  episodesWatched: number;
  studio?: string;
}
