import type { RouteRecordRaw } from "vue-router";
import DashboardView from "@modules/dashboard/DashboardView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/anime",
    name: "anime",
    component: () => import("@/modules/media/anime/views/AnimeView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/modules/user/views/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/modules/user/views/Settings.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/modules/search/views/SearchResultsView.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/auth",
    name: "auth",
    component: () => import("@/modules/user/views/AuthPage.vue"),
    meta: { guestOnly: true, hideLayout: true },
  },
  // Redirect /login to /auth for compatibility with guard
  {
    path: "/login",
    redirect: "/auth",
  },
  // {
  //   path: '/manga',
  //   name: 'manga',
  //   component: () => import('@/modules/media/manga/views/MangaDetailView.vue'),
  // },
  // // ... add other routes for games, movies, etc.
];

export default routes;
