import { BaseMapper } from "../../common/base/base-mapper.js";
import { TvSeries } from "./tv-series-schema.js";
import { TvSeriesDTO } from "./tv-series-dto.js";

export class TvSeriesMapper extends BaseMapper<TvSeries, TvSeriesDTO> {
  toDto(entity: TvSeries): TvSeriesDTO {
    return entity;
  }
}
