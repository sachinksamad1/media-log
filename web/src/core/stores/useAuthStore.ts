import { defineStore } from 'pinia';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/core/auth/firebase';
import { authService } from '@/modules/user/api/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isInitialLoading: true,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    initializeListener() {
      onAuthStateChanged(auth, (user) => {
        this.user = user;
        this.isInitialLoading = false;
      });
    },
    async login(email: string, pass: string) {
      const user = await authService.signIn(email, pass);
      this.user = user;
    },
    async register(email: string, pass: string) {
      const user = await authService.signUp(email, pass);
      this.user = user;
    },
    async googleLogin() {
      const user = await authService.googleSignIn();
      this.user = user;
    },
    async logout() {
      await authService.logout();
      this.user = null;
    }
  }
});