import type { RouteRecordRaw } from 'vue-router'

export const nonFictionRoutes: RouteRecordRaw[] = [
  {
    path: '/non-fiction',
    name: 'non-fiction',
    component: () => import('@/modules/media/nonFiction/views/NonFictionView.vue'),
    meta: { requiresAuth: true },
  },
]
