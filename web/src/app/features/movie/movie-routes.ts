import { Routes } from "@angular/router";
import { Movie } from "./movie";
import { MovieDetails } from "./movie-details/movie-details";

export const MovieRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: Movie,
                title: 'Movie'
            }
        ]
    },
    {
        path: ':id',
        component: MovieDetails,
        title: 'Movie Details'
    }
]
