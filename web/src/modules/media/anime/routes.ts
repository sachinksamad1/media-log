export default [
  {
    path: '/',
    component: () => import('./views/AnimeView.vue'),
    meta: { requiresAuth: true },
  },
  {
  path: '/anime/category',
  name: 'anime-category',
  component: () => import('./views/AnimeCategoryView.vue'),
  meta: { requiresAuth: true },
  props: true
}
];
