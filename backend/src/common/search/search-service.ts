import { AnimeRepository } from '../../modules/media/anime/anime-repo.js';
import { FictionRepository } from '../../modules/media/fiction/fiction-repo.js';
import { GameRepository } from '../../modules/media/game/game-repo.js';
import { LightNovelRepository } from '../../modules/media/light-novel/light-novel-repo.js';
import { MangaRepository } from '../../modules/media/manga/manga-repo.js';
import { MovieRepository } from '../../modules/media/movie/movie-repo.js';
import { NonFictionRepository } from '../../modules/media/non-fiction/non-fiction-repo.js';
import { TvSeriesRepository } from '../../modules/media/tv-series/tv-series-repo.js';

import type { GlobalSearchResponse } from './search-dto.js';
import type { SearchableMedia, SearchableRepository } from './search-types.js';

export class GlobalSearchService {
  private repositories: Record<string, SearchableRepository<SearchableMedia>>;

  constructor() {
    this.repositories = {
      anime: new AnimeRepository(),
      manga: new MangaRepository(),
      movie: new MovieRepository(),
      game: new GameRepository(),
      lightnovel: new LightNovelRepository(),
      tvseries: new TvSeriesRepository(),
      fiction: new FictionRepository(),
      nonfiction: new NonFictionRepository(),
    };
  }

  private formatDate(date: Date | { toDate: () => Date } | string | number | null | undefined): string {
    if (!date) return new Date().toISOString();
    // Handle Firestore Timestamp
    if (typeof (date as any).toDate === 'function') {
      return (date as any).toDate().toISOString();
    }
    // Handle native Date
    if (typeof (date as any).toISOString === 'function') {
      return (date as any).toISOString();
    }
    // Handle string or number
    return new Date(date as any).toISOString();
  }

  async search(query: string, type?: string): Promise<GlobalSearchResponse[]> {
    // Single-type search
    if (type) {
      const repo = this.repositories[type.toLowerCase()];
      if (!repo) return [];

      const results = await repo.searchByTitle(query);
      return results.map((r) => ({
        id: r.id,
        title: r.title,
        imageUrl: r.imageUrl ?? '',
        createdAt: this.formatDate(r.createdAt),
        updatedAt: this.formatDate(r.updatedAt),
        userStats: {
          score: r.userStats?.score ?? 0,
          status: r.userStats?.status ?? 'Planned',
        },
        mediaType: repo.getMediaType(),
      }));
    }

    // Global search
    const searches = Object.values(this.repositories).map(async repo => {
      const results = await repo.searchByTitle(query);
      return results.map((r) => ({
        id: r.id,
        title: r.title,
        imageUrl: r.imageUrl ?? '',
        createdAt: this.formatDate(r.createdAt),
        updatedAt: this.formatDate(r.updatedAt),
        userStats: {
          score: r.userStats?.score ?? 0,
          status: r.userStats?.status ?? 'Planned',
        },
        mediaType: repo.getMediaType(),
      }));
    });

    const all = await Promise.all(searches);
    return all.flat();
  }
}
