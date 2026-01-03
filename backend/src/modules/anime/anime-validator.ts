import { z } from "zod";
import { AnimeSchema } from "./anime-schema.js";

export const createAnimeValidator = z.object({
  body: AnimeSchema.omit({ id: true, createdAt: true, updatedAt: true }),
});

export const updateAnimeValidator = z.object({
  params: z.object({ id: z.string() }),
  body: AnimeSchema.partial(),

  
});
