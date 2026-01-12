export default [
  {
    path: '/manga',
    component: () => import('./components/MangaList.vue'),
    // meta: { requiresAuth: false },
  },
];
