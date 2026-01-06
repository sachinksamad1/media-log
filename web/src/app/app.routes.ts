import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
  // Default Route: Dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // Lazy Loading Dashboard Module
  {
    path: 'dashboard',
    component: Dashboard
  },

  // Lazy Loading Media Module
  {
    path: 'anime',
    loadChildren: () => import("./features/anime/anime-routes").then((m) => m.animeRoutes)
  },

  {
    path: 'fiction',
    loadChildren: () => import("./features/fiction/fiction-routes").then((m) => m.FictionRoutes)
  },

  {
    path: 'manga',
    loadChildren: () => import("./features/manga/manga-routes").then((m) => m.MangaRoutes)
  },

  {
    path: 'movie',
    loadChildren: () => import("./features/movie/movie-routes").then((m) => m.MovieRoutes)
  },

  {
    path: 'tv-show',
    loadChildren: () => import("./features/tv-show/tvShow-routes").then((m) => m.TvShowRoutes)
  },

  // Lazy Loading Profile Module
  {
    path: 'profile',
    component: Profile
  },

  // Lazy Loading Game Module
  {
    path: 'game',
    loadChildren: () => import("./features/game/game-module").then((m) => m.GameModule)
  },

  {
    path: 'non-fiction',
    loadChildren: () => import("./features/non-fiction/nonFiction-routes").then((m) => m.NonFictionRoutes)
  },
  {
    path: 'light-novel',
    loadChildren: () => import("./features/light-novel/lightNovel-routes").then((m) => m.LightNovelRoutes)
  },

  // Wildcard Route: 404 Not Found
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
