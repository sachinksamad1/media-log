import { AnimeRepository } from '@/modules/media/anime/anime-repo.js';
import { FictionRepository } from '@/modules/media/fiction/fiction-repo.js';
import { GameRepository } from '@/modules/media/game/game-repo.js';
import { LightNovelRepository } from '@/modules/media/light-novel/light-novel-repo.js';
import { MangaRepository } from '@/modules/media/manga/manga-repo.js';
import { MovieRepository } from '@/modules/media/movie/movie-repo.js';
import { NonFictionRepository } from '@/modules/media/non-fiction/non-fiction-repo.js';
import { TvSeriesRepository } from '@/modules/media/tv-series/tv-series-repo.js';

export const animeRepository = new AnimeRepository();
export const mangaRepository = new MangaRepository();
export const movieRepository = new MovieRepository();
export const gameRepository = new GameRepository();
export const lightNovelRepository = new LightNovelRepository();
export const tvSeriesRepository = new TvSeriesRepository();
export const fictionRepository = new FictionRepository();
export const nonFictionRepository = new NonFictionRepository();

export const repositories = {
  anime: animeRepository,
  manga: mangaRepository,
  movie: movieRepository,
  game: gameRepository,
  lightNovel: lightNovelRepository,
  tvSeries: tvSeriesRepository,
  fiction: fictionRepository,
  nonFiction: nonFictionRepository,
};
