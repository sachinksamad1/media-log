import type { GameDTO, GameUserStats, ApiResponse } from '@media-log/shared-types'

export type GameUserStatsDto = GameUserStats

export type GameDto = GameDTO

export type GameResponseDto = ApiResponse<GameDto[]>
