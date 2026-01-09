// src/features/anime/services/anime.service.ts
import { http } from '../../../services/http';
import type { Anime } from '../types';

export const AnimeService = {
  getAll(): Promise<Anime[]> {
    return http.get('/anime');
  },

  getById(id: string): Promise<Anime> {
    return http.get(`/anime/${id}`);
  },

  create(payload: Partial<Anime>): Promise<Anime> {
    return http.post('/anime', payload);
  },

  update(id: string, payload: Partial<Anime>): Promise<Anime> {
    return http.put(`/anime/${id}`, payload);
  },

  remove(id: string): Promise<void> {
    return http.delete(`/anime/${id}`);
  },
};
