import { Routes } from "@angular/router";
import { Manga } from "./manga";
import { MangaDetails } from "./manga-details/manga-details";

export const MangaRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: Manga,
                title: 'Manga'
            }
        ]
    },
    {
        path: ':id',
        component: MangaDetails,
        title: 'Manga Details'
    }
]

