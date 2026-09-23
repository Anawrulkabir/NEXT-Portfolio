/**
 * World store — useReducer + context scoped to the world island (§07.4).
 * Per-frame values (avatar x, camera x) live in refs, not here: React state
 * only changes on zone change, proximity change, open/close.
 */
import type { ZoneId } from '@/content/types'

export type WorldState = {
  zone: ZoneId
  nearestId: string | null
  focusedId: string | null
  openObjectId: string | null
  visited: ZoneId[]
  moving: boolean
}

export type WorldAction =
  | { type: 'zone'; zone: ZoneId }
  | { type: 'nearest'; id: string | null }
  | { type: 'focus'; id: string | null }
  | { type: 'open'; id: string }
  | { type: 'close' }
  | { type: 'moving'; moving: boolean }
  | { type: 'hydrateVisited'; visited: ZoneId[] }

export function worldReducer(state: WorldState, action: WorldAction): WorldState {
  switch (action.type) {
    case 'zone':
      if (state.zone === action.zone) return state
      return {
        ...state,
        zone: action.zone,
        visited: state.visited.includes(action.zone) ? state.visited : [...state.visited, action.zone],
      }
    case 'nearest':
      return state.nearestId === action.id ? state : { ...state, nearestId: action.id }
    case 'focus':
      return state.focusedId === action.id ? state : { ...state, focusedId: action.id }
    case 'open':
      return { ...state, openObjectId: action.id }
    case 'close':
      return { ...state, openObjectId: null }
    case 'moving':
      return state.moving === action.moving ? state : { ...state, moving: action.moving }
    case 'hydrateVisited': {
      const merged = Array.from(new Set([...action.visited, ...state.visited]))
      return { ...state, visited: merged }
    }
  }
}

const VISITED_KEY = 'world:visited'

export function readVisited(): ZoneId[] {
  try {
    const raw = sessionStorage.getItem(VISITED_KEY)
    return raw ? (JSON.parse(raw) as ZoneId[]) : []
  } catch {
    return []
  }
}

export function writeVisited(visited: ZoneId[]) {
  try {
    sessionStorage.setItem(VISITED_KEY, JSON.stringify(visited))
  } catch {
    // storage unavailable (private mode etc.) — visited state just won't persist
  }
}
