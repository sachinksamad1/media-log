import type { RouteRecordRaw } from 'vue-router'

export const gameRoutes: RouteRecordRaw[] = [
  {
    path: '/game',
    name: 'game',
    component: () => import('@/modules/media/game/views/GameView.vue'),
    meta: { requiresAuth: true },
  },
]
