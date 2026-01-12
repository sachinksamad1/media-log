import type { MediaDTO } from '../../../common/media/media-dto.js';

import type { TvSeries } from './tv-series-schema.js';

export interface TvSeriesDTO extends MediaDTO {
  directors: string[];
  writers: string[];
  cast: string[];
  genre: string[];
  origin: string;
  language: string;
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
