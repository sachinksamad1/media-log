import { z } from "zod";
import { GameSchema } from "./game-schema.js";

// 1. Validation for CREATE (POST)
export const createGamesValidator = z.object({
  body: GameSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
});

// 2. Validation for UPDATE (PATCH)
export const updateGamesValidator = z.object({
  params: z.object({
    id: z.string().min(1, "ID parameter is required"),
  }),
  body: GameSchema.partial(), // Makes all fields optional for partial updates
});

// 3. Validation for GET/DELETE by ID
export const gamesIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
