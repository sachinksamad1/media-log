import { z } from 'zod';

export const FictionSchema = z.object({
  id: z.string().optional(), // Auto-entry handled by Firestore
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  published: z.date().optional().or(z.string().regex(/\d{4}/)),
  
  // Categorization
  genres: z.array(z.string()).default([]),
  origin: z.string().optional(),
  language: z.string().optional(),
  format: z.enum(["E-Book", "Physical"]).default("E-Book"),
  type: z.enum(["Novel", "Short Story"]).default("Novel"),

  
  // Volume tracking
  volumes: z.array(z.object({
    order: z.number().int().min(1).default(1),
    total: z.number().int().min(1).default(1),
    isCompleted: z.boolean().default(false),
  })).default([]),
  
  // Status Tracking
  publicationStatus: z.enum(["Completed", "Ongoing", "Hiatus"]).default("Completed"),
  readingStatus: z.enum(["Planned", "Reading", "Completed", "Dropped"]).default("Planned"),
  
  // Scoring & Metadata
  score: z.number().min(0).max(10).default(0),
  imageUrl: z.string().url().optional().or(z.literal('')),
  
  // Audit Fields (Automated)
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Fiction = z.infer<typeof FictionSchema>;