import { BaseMapper } from "../../../common/base/base-mapper.js";
import { TvSeries } from "./tv-series-schema.js";
import { TvSeriesDTO } from "./tv-series-dto.js";
import { formatTimestamp } from "../../../common/utils/date-utils.js";

export class TvSeriesMapper extends BaseMapper<TvSeries, TvSeriesDTO> {
  toDto(entity: TvSeries): TvSeriesDTO {
    return {
      id: entity.id!,
      title: entity.title,
      genre: entity.genre,
      origin: entity.origin,
      language: entity.language,
      tvSeriesStats: entity.tvSeriesStats,
      userStats: entity.userStats,
      imageUrl: entity.imageUrl,
      createdAt: formatTimestamp(entity.createdAt),
      updatedAt: formatTimestamp(entity.updatedAt),
    };
  }
}
