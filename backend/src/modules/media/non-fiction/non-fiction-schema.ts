import { z } from 'zod';

export const NonFictionSchema = z.object({
  // Basic Info
  id: z.string().optional(), // Auto-entry handled by Firestore
  title: z.string().min(1, "Title is required"),
  
  // Categorization
  author: z.string().min(1, "Author is required"),
  genres: z.array(z.string()).default([]),
  origin: z.string().optional(),
  language: z.string().optional(),
  format: z.enum(["E-Book", "Physical"]).default("E-Book"),
  
  // Volume tracking
  published: z.date().optional().or(z.string().regex(/\d{4}/)),
  volumes: z.array(z.object({
    standalone: z.boolean().default(true),
    seriesName: z.string().optional(),
    order: z.number().int().min(1).default(1),
    total: z.number().int().min(1).default(1),
    isCompleted: z.boolean().default(true),    
  })).default([]),
  
  // Status Tracking
  userStats: z.object({
    score: z.number().min(0).max(10).default(5),
    status: z.enum(["Planned", "Ongoing", "Completed", "Dropped"]).default("Planned"),
  }).default({
    score: 5,
    status: "Planned",
  }),
  
  // Poster Image
  imageUrl: z.url().optional(),
  
  // Audit Info(Automated)
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type NonFiction = z.infer<typeof NonFictionSchema>;