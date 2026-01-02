import { z } from "zod";

export const LightNovelSchema = z.object({
  id: z.string().optional(), // Auto-entry handled by Firestore/DB
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  
  // Genres
  genres: z.array(z.string()).default([]), 
  
  // Format
  format: z.enum(["Web Novel", "Light Novel", "Physical", "Digital"]).default("Light Novel"),
  
  // Progress tracking
  currentReadingVolume: z.number().int().min(0).default(0),
  publishedVolumes: z.number().int().min(1).default(1),
  
  // Specific media types
  type: z.enum(["Light Novel", "Manhwa", "Manhua", "Manga"]).default("Light Novel"),
  
  // Release and Reading Status
  releaseStatus: z.enum(["Ongoing", "Completed", "Hiatus", "Cancelled"]).default("Ongoing"),
  readingStatus: z.enum(["Planned", "Reading", "Completed", "Dropped", "On Hold"]).default("Planned"),
  
  origin: z.string().default("Japan"), // e.g., Japan, South Korea, China
  score: z.number().min(0).max(10).default(0), // Added personal rating
  imageUrl: z.string().url().optional().or(z.literal('')), // For Firebase Storage links

  // Audit fields for tracking
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type LightNovel = z.infer<typeof LightNovelSchema>;