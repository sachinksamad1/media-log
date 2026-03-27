import type { GlobalSearchResponse } from '@/common/search/search-dto.js';
import type {
  SearchableMedia,
  SearchableRepository,
} from '@/common/search/search-types.js';
import { AnimeRepository } from '@/modules/media/anime/anime-repo.js';
import { FictionRepository } from '@/modules/media/fiction/fiction-repo.js';
import { GameRepository } from '@/modules/media/game/game-repo.js';
import { LightNovelRepository } from '@/modules/media/light-novel/light-novel-repo.js';
import { MangaRepository } from '@/modules/media/manga/manga-repo.js';
import { MovieRepository } from '@/modules/media/movie/movie-repo.js';
import { NonFictionRepository } from '@/modules/media/non-fiction/non-fiction-repo.js';
import { TvSeriesRepository } from '@/modules/media/tv-series/tv-series-repo.js';

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

  private formatDate(
    date: Date | { toDate: () => Date } | string | number | null | undefined,
  ): string {
    if (!date) return new Date().toISOString();

    // Handle Firestore Timestamp
    if (
      typeof date === 'object' &&
      'toDate' in date &&
      typeof (date as { toDate: () => Date }).toDate === 'function'
    ) {
      return (date as { toDate: () => Date }).toDate().toISOString();
    }

    // Handle native Date
    if (date instanceof Date) {
      return date.toISOString();
    }

    // Handle string or number
    if (typeof date === 'string' || typeof date === 'number') {
      return new Date(date).toISOString();
    }

    return new Date().toISOString();
  }

  async search(
    query: string,
    userId: string,
    type?: string,
  ): Promise<GlobalSearchResponse[]> {
    // Single-type search
    if (type) {
      const repo = this.repositories[type.toLowerCase()];
      if (!repo) return [];

      const results = await repo.searchByTitle(query, userId);
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
    const searches = Object.values(this.repositories).map(async (repo) => {
      const results = await repo.searchByTitle(query, userId);
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

  async getRandom(
    userId: string,
    type?: string,
  ): Promise<GlobalSearchResponse | null> {
    if (type) {
      const repo = this.repositories[type.toLowerCase()];
      if (!repo) return null;

      const randomItem = await repo.getRandom(userId);
      if (!randomItem) return null;

      return {
        id: randomItem.id,
        title: randomItem.title,
        imageUrl: randomItem.imageUrl ?? '',
        createdAt: this.formatDate(randomItem.createdAt),
        updatedAt: this.formatDate(randomItem.updatedAt),
        userStats: {
          score: randomItem.userStats?.score ?? 0,
          status: randomItem.userStats?.status ?? 'Planned',
        },
        mediaType: repo.getMediaType(),
      };
    }

    // Pick a random repository first to keep the search bounded,
    // rather than extracting all from all repos
    const repoKeys = Object.keys(this.repositories);

    // We shuffle keys and try them one by one until we get a hit
    // to ensure we bounce back if the first random repo is empty
    const shuffledKeys = repoKeys.sort(() => 0.5 - Math.random());

    for (const key of shuffledKeys) {
      const repo = this.repositories[key];
      if (!repo) continue;
      const randomItem = await repo.getRandom(userId);

      if (randomItem) {
        return {
          id: randomItem.id,
          title: randomItem.title,
          imageUrl: randomItem.imageUrl ?? '',
          createdAt: this.formatDate(randomItem.createdAt),
          updatedAt: this.formatDate(randomItem.updatedAt),
          userStats: {
            score: randomItem.userStats?.score ?? 0,
            status: randomItem.userStats?.status ?? 'Planned',
          },
          mediaType: repo.getMediaType(),
        };
      }
    }

    return null; // The user has no items across any repository
  }
}
