export type { TvSeriesDTO } from '@media-log/shared-types';
import type { TvSeries } from '@modules/media/tv-series/tv-series-schema.js';

export type CreateTvSeriesDto = Omit<
  TvSeries,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateTvSeriesDto = Partial<CreateTvSeriesDto>;
