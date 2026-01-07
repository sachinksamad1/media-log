import { LightNovel } from "./light-novel-schema.js";

export type CreateLightNovelDto = Omit<LightNovel, "id" | "createdAt" | "updatedAt">;

export type UpdateLightNovelDto = Partial<CreateLightNovelDto>;

export type LightNovelDTO = Omit<LightNovel, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

