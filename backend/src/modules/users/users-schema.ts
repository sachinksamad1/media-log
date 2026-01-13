import { z } from "zod";

const PreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  accentColor: z.string().default("#3B82F6"), // Store hex codes for UI branding
  language: z.string().default("en"),
  defaultView: z.enum(["grid", "list", "compact"]).default("grid"),
  itemsPerPage: z.number().int().min(10).max(100).default(20),
});

const PrivacySchema = z.object({
  isPublic: z.boolean().default(false), // Can others see the library?
  showAdultContent: z.boolean().default(false),
  showDetailedStats: z.boolean().default(true),
});

export const UserSchema = z.object({
  // Identity
  uid: z.string(), // The unique ID from Firebase Auth (use this as Document ID)
  username: z.string().min(3).max(25).trim(),
  email: z.email().lowercase(),
  displayName: z.string().optional(),
  avatarImg: z.string().optional().or(z.literal("")), // image

  // UI & Personalization
  preferences: PreferencesSchema.default(PreferencesSchema.parse({})),

  // Social & Privacy (For future features)
  privacy: PrivacySchema.default(PrivacySchema.parse({})),

  // Audit Info
  lastLogin: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type User = z.infer<typeof UserSchema>;