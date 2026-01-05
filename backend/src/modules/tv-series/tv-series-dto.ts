import { TvSeries } from "./tv-series-schema.js";

export type CreateTvSeriesDto = Omit<TvSeries, "id" | "createdAt" | "updatedAt">;

export type UpdateTvSeriesDto = Partial<CreateTvSeriesDto>;

export type TvSeriesDTO = TvSeries;
