import { MediaMapper } from '@common/media/media-mapper.js';
import type { TvSeriesDTO } from '@modules/media/tv-series/tv-series-dto.js';
import type { TvSeries } from '@modules/media/tv-series/tv-series-schema.js';

export class TvSeriesMapper extends MediaMapper<TvSeries, TvSeriesDTO> {
  protected mapSpecializedFields(entity: TvSeries): Partial<TvSeriesDTO> {
    return {
      directors: entity.directors,
      writers: entity.writers,
      cast: entity.cast,
      network: entity.network,
      studio: entity.studio,
      releaseDate: entity.releaseDate,
      endDate: entity.endDate,
      tvSeriesStats: entity.tvSeriesStats || {
        airingYear: 'Unknown',
        currentSeason: 1,
        totalSeasons: 1,
        isCompleted: false,
      },
    };
  }
}
