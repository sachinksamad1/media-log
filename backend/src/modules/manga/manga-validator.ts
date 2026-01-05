import { z } from "zod";
import { MangaSchema } from "./manga-schema.js";

// 1. Validation for CREATE (POST)
export const createMangaValidator = z.object({
  body: MangaSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
});

// 2. Validation for UPDATE (PATCH)
export const updateMangaValidator = z.object({
  params: z.object({
    id: z.string().min(1, "ID parameter is required"),
  }),
  body: MangaSchema.partial(), // Makes all fields optional for partial updates
});

// 3. Validation for GET/DELETE by ID
export const mangaIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
