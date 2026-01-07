import { Games } from "./game-schema.js";

export type CreateGameDto = Omit<Games, "id" | "createdAt" | "updatedAt">;

export type UpdateGameDto = Partial<CreateGameDto>;

export type GameDTO = Omit<Games, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

