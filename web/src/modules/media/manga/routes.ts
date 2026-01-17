export default [
  {
    path: "/manga",
    component: () => import("./views/MangaView.vue"),
    meta: { requiresAuth: true },
  },
];
