import {
  Injectable,
  PLATFORM_ID,
  inject,
  effect,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly storageKey = 'theme';

  readonly theme = signal<Theme>('light');

  constructor() {
    if (this.isBrowser) {
      this.theme.set(this.getInitialTheme());

      effect(() => {
        const theme = this.theme();

        document.documentElement.classList.toggle(
          'dark',
          theme === 'dark'
        );

        localStorage.setItem(this.storageKey, theme);
      });
    }
  }

  toggle(): void {
    if (!this.isBrowser) return;

    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  set(theme: Theme): void {
    if (!this.isBrowser) return;

    this.theme.set(theme);
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) {
      return 'light';
    }

    const stored = localStorage.getItem(this.storageKey) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
