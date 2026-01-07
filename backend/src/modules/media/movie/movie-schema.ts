import { z } from "zod";

export const MovieSchema = z.object({
  // Basic Info
  id: z.string().optional(), // Added by Firestore
  title: z.string().min(1, "Title is required"),

  // Categorization
  director: z.string().min(1, "Director is required"),
  cast: z.array(z.string()).min(1, "At least one cast member is required"),
  genre: z.array(z.string()).min(1, "At least one genre is required"),
  origin: z.string().min(1, "Origin is required"),
  language: z.string().min(1, "Language is required"),
  
  movieStats: z.object({
    released: z.enum(["Yes", "No"]).default("Yes"),
    releaseDate: z.coerce.date().optional(),
    releaseCountry: z.string().min(1, "Release country is required").optional()
  }),

  userStats: z.object({
    score: z.number().min(0).max(10).default(0),
    status: z.enum(["Planned", "Watching", "Completed", "Dropped", "On-Hold"]),
  }),

  // Poster & Image
  imageUrl: z.url().optional(), // For Firebase Storage links


  // Audit Info(Automated)
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Extract the type from the schema for use in Services/Repos
export type Movie = z.infer<typeof MovieSchema>;