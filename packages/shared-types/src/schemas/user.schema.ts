import { z } from "zod";

// =============================================================================
// USER PREFERENCES SCHEMA
// =============================================================================

export const ThemeEnum = z.enum(["light", "dark", "system"]);
export const DefaultViewEnum = z.enum(["grid", "list", "compact"]);

export const UserPreferencesSchema = z.object({
  theme: ThemeEnum.default("system"),
  accentColor: z.string().default("#3B82F6"),
  language: z.string().default("en"),
  defaultView: DefaultViewEnum.default("grid"),
  itemsPerPage: z.number().int().min(10).max(100).default(20),
});

export const UserPrivacySchema = z.object({
  isPublic: z.boolean().default(false),
  showAdultContent: z.boolean().default(false),
  showDetailedStats: z.boolean().default(true),
});

// =============================================================================
// USER SCHEMA
// =============================================================================

export const UserSchema = z.object({
  // Identity
  uid: z.string(),
  username: z.string().min(3).max(25).trim(),
  email: z.string().email().toLowerCase(),
  displayName: z.string().optional(),
  avatarImg: z.string().optional().or(z.literal("")),

  // UI & Personalization
  preferences: UserPreferencesSchema.optional(),

  // Social & Privacy
  privacy: UserPrivacySchema.optional(),

  // Audit Info
  lastLogin: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Theme = z.infer<typeof ThemeEnum>;
export type DefaultView = z.infer<typeof DefaultViewEnum>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UserPrivacy = z.infer<typeof UserPrivacySchema>;
export type User = z.infer<typeof UserSchema>;

// =============================================================================
// USER DTO (for API responses)
// =============================================================================

export interface UserDTO {
  uid: string;
  username: string;
  email: string;
  displayName?: string;
  avatarImg?: string;
  preferences?: {
    theme: string;
    accentColor: string;
    language: string;
    defaultView: string;
    itemsPerPage: number;
  };
  privacy?: {
    isPublic: boolean;
    showAdultContent: boolean;
    showDetailedStats: boolean;
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
