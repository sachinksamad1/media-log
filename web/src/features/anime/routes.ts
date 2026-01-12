export default [
  {
    path: '/anime',
    component: () => import('./components/AnimeList.vue'),
    // meta: { requiresAuth: false },
  },
  {
  path: '/anime/:status',
  name: 'anime-category',
  component: () => import('./components/AnimeCategoryView.vue'),
  props: true
}
];
