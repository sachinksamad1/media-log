import { NonFiction } from "./non-fiction-schema.js";

export type CreateNonFictionDto = Omit<NonFiction, "id" | "createdAt" | "updatedAt">;

export type UpdateNonFictionDto = Partial<CreateNonFictionDto>;

export type NonFictionDTO = Omit<NonFiction, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

