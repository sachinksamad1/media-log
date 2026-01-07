import { Fiction } from "./fiction-schema.js";

export type CreateFictionDto = Omit<Fiction, "id" | "createdAt" | "updatedAt">;

export type UpdateFictionDto = Partial<CreateFictionDto>;

export type FictionDTO = Omit<Fiction, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
