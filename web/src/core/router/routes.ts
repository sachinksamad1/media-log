import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@modules/dashboard/DashboardView.vue';

const routes = createRouter({
  history: createWebHistory(`${import.meta.env.BASE_URL}`),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/anime',
      name: 'anime',
      component: () => import('@/modules/media/anime/views/AnimeView.vue'), 
    },
    // {
    //   path: '/manga',
    //   name: 'manga',
    //   component: () => import('@/modules/media/manga/views/MangaDetailView.vue'),
    // },
    // // ... add other routes for games, movies, etc.
  ],
});

export default routes;