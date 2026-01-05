import { Manga } from "./manga-schema.js";

export type CreateMangaDto = Omit<Manga, "id" | "createdAt" | "updatedAt">;

export type UpdateMangaDto = Partial<CreateMangaDto>;

export type MangaDTO = Manga;
