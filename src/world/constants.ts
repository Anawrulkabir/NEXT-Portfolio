/** World geometry — see docs/PORTFOLIO_REDESIGN.md §05.1. All values in source px. */
export const TILE = 16
export const WORLD_ROWS = 12
export const WORLD_HEIGHT = TILE * WORLD_ROWS // 192
export const GROUND_ROW = 9
export const GROUND_Y = GROUND_ROW * TILE // 144 — avatar feet
export const WALK_SPEED = 96 // source px / s
export const PROXIMITY = 3 * TILE // tooltip range
export const DEAD_ZONE = 0.3 // fraction of viewport width
export const AVATAR_W = 18
export const AVATAR_H = 24
