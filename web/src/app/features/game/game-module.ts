import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutes } from './game-routes';
import { RouterModule } from '@angular/router';
import { Game } from './game';
import { GameDetails } from './game-details/game-details';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(GameRoutes),
        Game,
        GameDetails,
    ],
})
export class GameModule { }
