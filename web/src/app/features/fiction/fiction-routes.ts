import { Routes } from "@angular/router";
import { Fiction } from "./fiction";
import { FictionDetails } from "./compoments/fiction-details/fiction-details";

export const FictionRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: Fiction,
                title: 'Fiction',
            },
        ],
    },
    {
        path: 'fiction/:id',
        component: FictionDetails,
        title: 'Fiction Details',
    },
];
