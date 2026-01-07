import { z } from "zod";

export const AnimeSchema = z.object({
  // Basic Info
  id: z.string().optional(), // Added by Firestore
  title: z.string().min(1, "Title is required"),
  
  // Categorization
  genre: z.array(z.string()).optional(),
  origin: z.string().optional().default("Japan"),
  language: z.string().optional().default("Japanese"),

  // Release Status
  releaseStats: z.object({
    totalSeasons: z.number().int().default(1),
    isCompleted: z.boolean().default(false)
  }).optional(),

  userStats: z.object({
    score: z.number().min(0).max(10).default(5),
    status: z.enum(["Planned", "Ongoing", "Completed", "Dropped"]).default("Planned"),
  }).optional(),

  // Poster Image
  imageUrl: z.url().optional(), // For Firebase Storage links

  // Audit Info(Automated)
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Extract the type from the schema for use in Services/Repos
export type Anime = z.infer<typeof AnimeSchema>;