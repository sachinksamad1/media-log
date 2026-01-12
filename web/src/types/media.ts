export type MediaType = "novel" | "nonfiction" | "manga" | "lightnovel" | "anime" | "movie" | "game";
export type MediaStatus = "ongoing" | "planned" | "completed";

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  coverUrl: string;
  progress?: number;
  total?: number;
  rating?: number;
  year?: number;
}

export interface MediaCategory {
  type: MediaType;
  label: string;
  icon: string;
}

export const MEDIA_CATEGORIES: MediaCategory[] = [
  { type: "anime", label: "Anime", icon: "Tv" },
  { type: "manga", label: "Manga", icon: "BookOpen" },
  { type: "novel", label: "Novels", icon: "Book" },
  { type: "lightnovel", label: "Light Novels", icon: "BookText" },
  { type: "nonfiction", label: "Non-Fiction", icon: "GraduationCap" },
  { type: "movie", label: "Movies", icon: "Film" },
  { type: "game", label: "Games", icon: "Gamepad2" },
];
