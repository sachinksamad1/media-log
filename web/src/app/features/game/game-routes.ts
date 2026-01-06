import { Routes } from "@angular/router";
import { Game } from "./game";
import { GameDetails } from "./game-details/game-details";

export const GameRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: Game,
                title: 'Game',
            },
        ],
    },
    {
        path: ':id',
        component: GameDetails,
        title: 'Game Details',
    },
];
