import type { RouteRecordRaw } from "vue-router";

export const animeRoutes: RouteRecordRaw[] = [
  {
    path: "/anime",
    name: "anime",
    component: () => import("@/modules/media/anime/views/AnimeView.vue"),
    meta: { requiresAuth: true },
  }
];
