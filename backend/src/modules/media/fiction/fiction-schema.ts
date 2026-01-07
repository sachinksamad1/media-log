import { z } from 'zod';

export const FictionSchema = z.object({
  // Basic Info
  id: z.string().optional(), // Auto-entry handled by Firestore
  title: z.string().min(1, "Title is required"),
  
  // Categorization
  author: z.string().optional(),
  genres: z.array(z.string()).optional(),
  origin: z.string().optional(),
  language: z.string().optional(),
  format: z.enum(["E-Book", "Physical"]).default("E-Book"),
  type: z.enum(["Novel", "Short Story"]).default("Novel"),

  // Publication Info
  publicationInfo: z.array(z.object({
    published: z.date().optional().or(z.string().regex(/\d{4}/)),
    volumes: z.number().int().min(1).default(1),
    status: z.enum(["Completed", "Ongoing", "Hiatus"]).default("Completed"),
  })).default([{volumes: 1, status: "Completed"}]),
  
  // User Stats
  userStats: z.object({
    score: z.number().min(0).max(10),
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

export type Fiction = z.infer<typeof FictionSchema>;