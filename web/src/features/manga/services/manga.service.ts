// src/features/anime/services/anime.service.ts
import { http } from '../../../services/http';
import type { Manga } from '../types';

export const MangaService = {
  getAll(): Promise<Manga[]> {
    return http.get('/manga');
  },

  getById(id: string): Promise<Manga> {
    return http.get(`/manga/${id}`);
  },

  create(payload: Partial<Manga>): Promise<Manga> {
    return http.post('/manga', payload);
  },

  update(id: string, payload: Partial<Manga>): Promise<Manga> {
    return http.put(`/manga/${id}`, payload);
  },

  remove(id: string): Promise<void> {
    return http.delete(`/manga/${id}`);
  },
};
