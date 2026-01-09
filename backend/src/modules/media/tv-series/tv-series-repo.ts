import { MediaRepository } from "../../../common/media/media-repository.js";
import { TvSeries } from "./tv-series-schema.js";

export class TvSeriesRepository extends MediaRepository<TvSeries> {
  constructor() {
    super("tv_series");
  }
}
