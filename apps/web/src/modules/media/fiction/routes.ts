import type { RouteRecordRaw } from 'vue-router'

export const fictionRoutes: RouteRecordRaw[] = [
  {
    path: '/fiction',
    name: 'fiction',
    component: () => import('@/modules/media/fiction/views/FictionView.vue'),
    meta: { requiresAuth: true },
  },
]
