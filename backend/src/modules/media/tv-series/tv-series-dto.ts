import type { MediaDTO } from '@common/media/media-dto.js';
import type { TvSeries } from '@modules/media/tv-series/tv-series-schema.js';

export interface TvSeriesDTO extends MediaDTO {
  directors: string[];
  writers: string[];
  cast: string[];
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
