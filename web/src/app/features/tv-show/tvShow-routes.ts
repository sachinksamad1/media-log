import { Routes } from "@angular/router";
import { TvShow } from "./tv-show";
import { TvShowDetails } from "./tv-show-details/tv-show-details";

export const TvShowRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: TvShow,
                title: 'Tv Show'
            }
        ]
    },
    {
        path: ':id',
        component: TvShowDetails,
        title: 'TvShow Details'
    }
]
