export const userRoutes = [
  {
    path: '/auth',
    component: () => import('@/modules/user/views/AuthPage.vue')
  },
  {
    path: '/profile',
    component: () => import('@/modules/user/views/Profile.vue')
  }
];