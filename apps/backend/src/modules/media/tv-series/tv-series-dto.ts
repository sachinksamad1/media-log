import type { MediaDTO } from '@common/media/media-dto.js';
import type { TvSeries } from '@modules/media/tv-series/tv-series-schema.js';

export interface TvSeriesDTO extends MediaDTO {
  directors: string[];
  writers: string[];
  cast: string[];
  network?: string;
  studio?: string;
  releaseDate?: string;
  endDate?: string;
  userStats: {
    score: number;
    status: string;
    watchedEpisodes: number;
    rewatchCount: number;
  };
  tvSeriesStats: {
    airingYear: string;
    currentSeason: number;
    totalSeasons: number;
    totalEpisodes?: number;
    isCompleted: boolean;
  };
}

export type CreateTvSeriesDto = Omit<
  TvSeries,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateTvSeriesDto = Partial<CreateTvSeriesDto>;
