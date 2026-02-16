import type { RouteRecordRaw } from 'vue-router'
import DashboardView from '@modules/dashboard/DashboardView.vue'
import { animeRoutes } from '@modules/media/anime/routes'
import { mangaRoutes } from '@modules/media/manga/routes'
import { lightNovelRoutes } from '@modules/media/lightNovel/routes'
import { fictionRoutes } from '@modules/media/fiction/routes'
import { nonFictionRoutes } from '@modules/media/nonFiction/routes'
import { gameRoutes } from '@modules/media/game/routes'
import { movieRoutes } from '@modules/media/movie/routes'
import { tvSeriesRoutes } from '@modules/media/tvSeries/routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/modules/user/views/Profile.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/modules/user/views/Settings.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/modules/search/views/SearchResultsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('@/modules/stats/view/StatsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/modules/report/view/ReportView.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/modules/user/views/AuthPage.vue'),
    meta: { guestOnly: true, hideLayout: true },
  },
  // Redirect /login to /auth for compatibility with guard
  {
    path: '/login',
    name: 'login',
    redirect: { name: 'auth' },
  },
  ...animeRoutes,
  ...mangaRoutes,
  ...lightNovelRoutes,
  ...fictionRoutes,
  ...nonFictionRoutes,
  ...gameRoutes,
  ...movieRoutes,
  ...tvSeriesRoutes,
  // // ... add other routes for games, movies, etc.
]

export default routes
