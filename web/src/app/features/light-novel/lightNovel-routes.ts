import { Routes } from "@angular/router";
import { LightNovel } from "./light-novel";
import { LightNovelDetails } from "./light-novel-details/light-novel-details";

export const LightNovelRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: LightNovel,
                title: 'Light Novel'
            }
        ]
    },
    {
        path: ':id',
        component: LightNovelDetails,
        title: 'Light Novel Details'
    }
]
