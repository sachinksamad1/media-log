import { Anime } from "./anime-schema.js";

export type CreateAnimeDto = Omit<Anime, "id" | "createdAt" | "updatedAt">;

export type UpdateAnimeDto = Partial<CreateAnimeDto>;

export type AnimeDTO = Omit<Anime, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};