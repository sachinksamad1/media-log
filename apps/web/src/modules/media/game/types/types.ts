/**
 * Re-export from shared package for backward compatibility.
 * New code should import directly from '@media-log/shared-types'
 */
export type { GameUserStats, Playthrough, GameDTO as Game } from '@media-log/shared-types'

import type { ApiResponse, ApiMeta } from '@media-log/shared-types'
import type { GameDTO } from '@media-log/shared-types'

// Game Response
export interface GameResponse extends ApiResponse<GameDTO[]> {
  meta?: ApiMeta
}
