import type { RouteRecordRaw } from 'vue-router'

export const movieRoutes: RouteRecordRaw[] = [
  {
    path: '/movie',
    name: 'movie',
    component: () => import('@/modules/media/movie/views/MovieView.vue'),
    meta: { requiresAuth: true },
  },
]
