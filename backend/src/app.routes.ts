import { protect } from '@common/middlewares/auth-middleware.js';
import searchRoutes from '@common/search/search-routes.js';
import dashboardRoutes from '@modules/dashboard/dashboard-routes.js';
import animeRoutes from '@modules/media/anime/anime-routes.js';
import fictionRoutes from '@modules/media/fiction/fiction-routes.js';
import gamesRoutes from '@modules/media/game/game-routes.js';
import lightNovelRoutes from '@modules/media/light-novel/light-novel-routes.js';
import mangaRoutes from '@modules/media/manga/manga-routes.js';
import moviesRoutes from '@modules/media/movie/movie-routes.js';
import nonFictionRoutes from '@modules/media/non-fiction/non-fiction-routes.js';
import tvSeriesRoutes from '@modules/media/tv-series/tv-series-routes.js';
import usersRoutes from '@modules/users/users-routes.js';
import healthRoutes from '@platform/health-routes.js';
import { Router } from 'express';

const router = Router();

// Health Routes
router.use('/health', healthRoutes);
// Auth Routes
router.use('/auth', protect);
// Dashboard Routes
router.use('/dashboard', dashboardRoutes);
// Search Routes
router.use('/search', searchRoutes);
// Anime Routes
router.use('/anime', animeRoutes);
// Fiction Routes
router.use('/fiction', fictionRoutes);
// Games Routes
router.use('/games', gamesRoutes);
// Light Novel Routes
router.use('/light-novel', lightNovelRoutes);
// Manga Routes
router.use('/manga', mangaRoutes);
// Movies Routes
router.use('/movie', moviesRoutes);
// Non Fiction Routes
router.use('/non-fiction', nonFictionRoutes);
// TV Series Routes
router.use('/tv-series', tvSeriesRoutes);
// Users Routes
router.use('/users', usersRoutes);

export default router;
