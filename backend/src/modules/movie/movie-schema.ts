import { z } from "zod";

export const MovieSchema = z.object({
  id: z.string().optional(), // Added by Firestore
  title: z.string().min(1, "Title is required"),
  releaseDate: z.string().datetime(),
  director: z.string().min(1, "Director is required"),
  cast: z.array(z.string()).min(1, "At least one cast member is required"),
  genre: z.array(z.string()).min(1, "At least one genre is required"),
  origin: z.string().min(1, "Origin is required"),
  language: z.string().min(1, "Language is required"),
  
  movieStats: z.object({
    released: z.enum(["Yes", "No"]).default("No"),
    releaseDate: z.string().datetime().optional(),
    releaseCountry: z.string().min(1, "Release country is required").optional()
  }),

  userStats: z.object({
    score: z.number().min(0).max(10).default(0),
    status: z.enum(["Planned", "Watching", "Completed", "Dropped", "On-Hold"]),
  }),

  imageUrl: z.string().url("Invalid image URL").optional(),

  metadata: z.object({
    createdAt: z.string().datetime().optional(), // Or z.date() if using native JS dates
    updatedAt: z.string().datetime().optional(),
  })
});

// Extract the type from the schema for use in Services/Repos
export type Movie = z.infer<typeof MovieSchema>;