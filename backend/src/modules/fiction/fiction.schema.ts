import { z } from 'zod';

export const FictionSchema = z.object({
  id: z.string().optional(), // Auto-entry handled by Firestore
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  
  // Using arrays for better search/filtering in Flutter/Angular
  genres: z.array(z.string()).default([]),
  
  // Categorization
  format: z.enum(["Standalone", "Series", "Trilogy"]).default("Standalone"),
  type: z.enum(["Novel", "Novella", "Short Story", "Anthology"]).default("Novel"),
  origin: z.string().default("Japan"),
  
  // Volume tracking
  volumeOrder: z.number().int().min(1).default(1),
  volumesPublished: z.number().int().min(1).default(1),
  
  // Status Tracking
  releaseStatus: z.enum(["Completed", "Ongoing", "Hiatus"]).default("Completed"),
  readingStatus: z.enum(["Planned", "Reading", "Completed", "Dropped"]).default("Planned"),
  
  // Scoring & Metadata
  score: z.number().min(0).max(10).default(0),
  imageUrl: z.string().url().optional().or(z.literal('')),
  
  // Audit Fields (Automated)
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Fiction = z.infer<typeof FictionSchema>;