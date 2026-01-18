import type { RouteRecordRaw } from "vue-router";

export const tvSeriesRoutes: RouteRecordRaw[] = [
  {
    path: "/tv-series",
    name: "tv-series",
    component: () => import("@/modules/media/tvSeries/views/TvSeriesView.vue"),
    meta: { requiresAuth: true },
  }
];
