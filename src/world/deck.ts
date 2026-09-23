/**
 * Scene Deck (§12): the mobile world, cut into eight scenes. Each scene is a
 * 360×248 window onto one zone — 56 px of sky above the zone's 192-px strip —
 * showing that zone's objects. Objects that sit outside the window in the
 * walkable world are moved in (`overrides`), so every object stays reachable.
 * The Data Center needs two frames (§12.2); the others have one.
 */
import type { ZoneId } from '@/content/types'
import { TILE } from './constants'
import { placedObjects, zoneById, type PlacedObject } from './layout'

export const SCENE_W = 360
export const SCENE_H = 248
export const SKY_H = SCENE_H - 12 * TILE // 56

type SceneSpec = {
  zone: ZoneId
  frames: number[] // zone-relative x of each frame's left edge
  overrides?: Record<string, { x: number; y?: number }> // zone-relative
}

const specs: SceneSpec[] = [
  { zone: 'workshop', frames: [0], overrides: { 'soccer-bot': { x: 300 } } },
  { zone: 'dungeon', frames: [80] },
  { zone: 'garage', frames: [64], overrides: { 'sticky-wall': { x: 376, y: 70 } } },
  { zone: 'software', frames: [48], overrides: { 'toolbox-software': { x: 370 } } },
  { zone: 'datacenter', frames: [0, 280] },
  { zone: 'physics-lab', frames: [64] },
  { zone: 'thermal-lab', frames: [64], overrides: { 'interests-board': { x: 300, y: 52 } } },
  { zone: 'overlook', frames: [0] },
]

export type DeckObject = { placed: PlacedObject; x: number; y: number } // zone-relative source px
export type DeckScene = { zone: ZoneId; frames: number[]; objects: DeckObject[]; zoneWidth: number }

export const deckScenes: DeckScene[] = specs.map((spec) => {
  const z = zoneById[spec.zone]
  return {
    zone: spec.zone,
    frames: spec.frames,
    zoneWidth: z.endX - z.startX,
    objects: placedObjects
      .filter((o) => o.zone === spec.zone)
      .map((o) => {
        const ov = spec.overrides?.[o.ref.objectId]
        return { placed: o, x: ov?.x ?? o.x - z.startX, y: ov?.y ?? o.y }
      }),
  }
})

/** Which frame of a scene shows an object (Data Center has two). */
export const frameFor = (scene: DeckScene, objectId: string) => {
  const o = scene.objects.find((d) => d.placed.ref.objectId === objectId)
  if (!o) return 0
  const i = scene.frames.findIndex((x0) => o.x >= x0 && o.x + o.placed.sprite.w <= x0 + SCENE_W)
  return Math.max(0, i)
}
