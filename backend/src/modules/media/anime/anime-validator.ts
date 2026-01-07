import { z } from "zod";
import { AnimeSchema } from "./anime-schema.js";

// 1. Validation for CREATE (POST)
export const createAnimeValidator = z.object({
  body: AnimeSchema.omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true 
  })
});

// 2. Validation for UPDATE (PATCH)
export const updateAnimeValidator = z.object({
  params: z.object({
    id: z.string().min(1, "ID parameter is required"),
  }),
  body: AnimeSchema.partial() // Makes all fields optional for partial updates
});

// 3. Validation for GET/DELETE by ID
export const animeIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});