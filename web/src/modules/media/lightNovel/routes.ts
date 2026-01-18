import type { RouteRecordRaw } from "vue-router";

export const lightNovelRoutes: RouteRecordRaw[] = [
  {
    path: "/light-novel",
    name: "light-novel",
    component: () =>
      import("@/modules/media/lightNovel/views/LightNovelView.vue"),
    meta: { requiresAuth: true },
  },
];