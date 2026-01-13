export default [
  {
    path: '/',
    component: () => import('./views/AnimeView.vue'),
    // meta: { requiresAuth: false },
  },
  {
  path: '/anime/category',
  name: 'anime-category',
  component: () => import('./views/AnimeCategoryView.vue'),
  props: true
}
];
