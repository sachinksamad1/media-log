import { z } from "zod";
import { MovieSchema } from "./movie-schema.js";

// 1. Validation for CREATE (POST)
export const createMovieValidator = z.object({
  body: MovieSchema.omit({
    id: true,
    metadata: true,
  }),
});

// 2. Validation for UPDATE (PATCH)
export const updateMovieValidator = z.object({
  params: z.object({
    id: z.string().min(1, "ID parameter is required"),
  }),
  body: MovieSchema.partial(), // Makes all fields optional for partial updates
});

// 3. Validation for GET/DELETE by ID
export const movieIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
