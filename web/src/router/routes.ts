import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../features/dashboard/DashboardView.vue';

const routes = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/anime',
      name: 'anime',
      // Lazy load the Anime module
      component: () => import('../features/anime/AnimeView.vue'), 
    },
    {
      path: '/manga',
      name: 'manga',
      component: () => import('../features/manga/MangaView.vue'),
    },
    // ... add other routes for games, movies, etc.
  ],
});

export default routes;