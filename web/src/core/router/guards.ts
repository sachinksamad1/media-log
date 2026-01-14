import { useAuthStore } from "@/core/stores/useAuthStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export default function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next("/auth");
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return next("/");
  }

  next();
}
