import { Games } from "./games-schema.js";

export type CreateGameDto = Omit<Games, "id" | "createdAt" | "updatedAt">;

export type UpdateGameDto = Partial<CreateGameDto>;

export type GameDTO = Games;
