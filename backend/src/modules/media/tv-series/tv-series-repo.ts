import { BaseRepository } from "../../../common/base/base-repository.js";
import { TvSeries } from "./tv-series-schema.js";

export class TvSeriesRepository extends BaseRepository<TvSeries> {
  constructor() {
    super("tv_series");
  }
}
