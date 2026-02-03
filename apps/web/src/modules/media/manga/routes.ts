import type { RouteRecordRaw } from 'vue-router'

export const mangaRoutes: RouteRecordRaw[] = [
  {
    path: '/manga',
    name: 'manga',
    component: () => import('@/modules/media/manga/views/MangaView.vue'),
    meta: { requiresAuth: true },
  },
]
