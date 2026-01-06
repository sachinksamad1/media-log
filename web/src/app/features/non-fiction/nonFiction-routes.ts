import { Routes } from "@angular/router";
import { NonFiction } from "./non-fiction";
import { NonFictionDetails } from "./non-fiction-details/non-fiction-details";

export const NonFictionRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: NonFiction,
                title: 'Non Fiction'
            }
        ]
    },
    {
        path: ':id',
        component: NonFictionDetails,
        title: 'Non Fiction Details'
    }
]
