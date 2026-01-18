import http from "@common/api/http";
import type { GameResponse, Game } from "@modules/media/game/types/types";
import type { GameResponseDto, GameDto } from "@modules/media/game/types/dtos";
import { GameMapper } from "@modules/media/game/api/gameMapper";

export const GameService = {
  async getAll(
    limit?: number,
    cursor?: string,
    status?: string
  ): Promise<GameResponse> {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);
    if (status) params.append("status", status);

    const { data } = await http.get<GameResponseDto>(
      `/games?${params.toString()}`
    );
    return { ...data, data: data.data.map(GameMapper.toDomain) };
  },

  async create(game: Partial<Game> | FormData): Promise<Game> {
    const { data } = await http.post<GameDto>("/games", game);
    return GameMapper.toDomain(data);
  },

  async update(id: string, game: Partial<Game> | FormData): Promise<Game> {
    const { data } = await http.patch<GameDto>(`/games/${id}`, game);
    return GameMapper.toDomain(data);
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/games/${id}`);
  },

  async search(query: string): Promise<Game[]> {
    const params = new URLSearchParams();
    params.append("query", query);
    params.append("type", "game");

    const { data } = await http.get<{ data: GameDto[] }>(
      `/search?${params.toString()}`
    );
    return data.data.map(GameMapper.toDomain);
  },
};
