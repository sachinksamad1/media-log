import { Routes } from "@angular/router";
import { Anime } from './anime';
import { AnimeDetail } from "./components/anime-detail/anime-detail";

export const animeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: Anime,
        title: 'Anime'
      },
      {
        path: ':id',
        component: AnimeDetail,
        title: 'Anime Detail'
      }
    ]
  }
];

