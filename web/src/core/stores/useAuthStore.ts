import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/core/auth/firebase';
import { authService } from '@/modules/user/api/authService';
import { userService } from "@/modules/user/api/userService";
import type { UserDto } from "@/modules/user/dtos/user.dto";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    profile: null as UserDto | null,
    isInitialLoading: true,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    userProfile: (state) => state.profile,
  },
  actions: {
    initializeListener() {
      onAuthStateChanged(auth, async (user) => {
        this.user = user;
        if (user) {
          try {
            const profile = await userService.syncUser();
            this.profile = profile;
          } catch (error) {
            console.error("Failed to sync user profile:", error);
          }
        } else {
          this.profile = null;
        }
        this.isInitialLoading = false;
      });
    },
    async login(email: string, pass: string) {
      const user = await authService.signIn(email, pass);
      this.user = user;
      const profile = await userService.syncUser();
      this.profile = profile;
    },
    async register(
      email: string,
      pass: string,
      username: string,
      displayName?: string
    ) {
      const user = await authService.signUp(email, pass, displayName);
      this.user = user;
      // Sync user with backend, providing username
      const profile = await userService.syncUser({ username, displayName });
      this.profile = profile;
    },
    async googleLogin() {
      const user = await authService.googleSignIn();
      this.user = user;
      const profile = await userService.syncUser({
        displayName: user.displayName || undefined,
        avatarImg: user.photoURL || undefined,
      });
      this.profile = profile;
    },
    async logout() {
      await authService.logout();
      this.user = null;
      this.profile = null;
    },
  },
});