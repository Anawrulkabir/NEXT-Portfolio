/**
 * World geometry — zone extents and object placements. Geometry only; every
 * fact shown for an object comes from src/content via its objectId
 * (docs/PORTFOLIO_REDESIGN.md §05.1, §07.1).
 *
 * Rooms (Archive, Field Office) are separate scenes entered through doors
 * (I-07, Phase 7), so they aren't part of this walkable strip.
 */
import { journeyChapters } from '@/content'
import type { JourneyChapter, WorldObjectRef, ZoneId } from '@/content/types'
import { TILE, GROUND_Y } from './constants'
import type { Sprite } from './pixel'
import { signpostSprite, soccerBotSprite, workbenchSprite } from './sprites/workshop'

export type ZoneLayout = {
  id: ZoneId
  chapter: JourneyChapter
  widthTiles: number
  startX: number // source px
  endX: number // source px
  keyColor: string // CSS var for placeholder ground + route strip
  built: boolean // full art in place (vs. Phase 2 colour-block placeholder)
}

export type PlacedObject = {
  ref: WorldObjectRef
  zone: ZoneId
  x: number // source px, left edge
  y: number // source px, top edge
  sprite: Sprite
  animate?: 'tick' // soccer bot wheel tick
}

const zoneSpec: { id: ZoneId; widthTiles: number; keyColor: string; built: boolean }[] = [
  { id: 'workshop', widthTiles: 40, keyColor: 'var(--zone-workshop)', built: true },
  { id: 'dungeon', widthTiles: 40, keyColor: 'var(--zone-dungeon)', built: false },
  { id: 'garage', widthTiles: 40, keyColor: 'var(--zone-garage)', built: false },
  { id: 'software', widthTiles: 40, keyColor: 'var(--zone-software)', built: false },
  { id: 'datacenter', widthTiles: 40, keyColor: 'var(--zone-datacenter)', built: false },
  { id: 'physics-lab', widthTiles: 40, keyColor: 'var(--zone-physics-lab)', built: false },
  { id: 'thermal-lab', widthTiles: 40, keyColor: 'var(--zone-thermal-lab)', built: false },
  { id: 'overlook', widthTiles: 24, keyColor: 'var(--moss)', built: false },
]

const chapterById = Object.fromEntries(journeyChapters.map((c) => [c.id, c]))

let cursor = 0
export const zones: ZoneLayout[] = zoneSpec.map((z) => {
  const startX = cursor
  cursor += z.widthTiles * TILE
  return { ...z, chapter: chapterById[z.id], startX, endX: cursor }
})

export const WORLD_WIDTH = cursor

export const zoneById = Object.fromEntries(zones.map((z) => [z.id, z])) as Record<ZoneId, ZoneLayout>

/** The seven walkable chapters shown on the route strip (excludes the overlook). */
export const routeZones = zones.filter((z) => z.id !== 'overlook')

export function zoneAt(x: number): ZoneLayout {
  return zones.find((z) => x >= z.startX && x < z.endX) ?? zones[zones.length - 1]
}

/** Where the avatar stands when arriving at a zone (just inside its sign). */
export const zoneEntranceX = (id: ZoneId) => zoneById[id].startX + 3 * TILE

const refFor = (zone: ZoneId, objectId: string): WorldObjectRef => {
  const ref = chapterById[zone]?.objects.find((o) => o.objectId === objectId)
  if (!ref) throw new Error(`world/layout: no content object "${objectId}" in zone "${zone}"`)
  return ref
}

const onGround = (sprite: Sprite) => GROUND_Y - sprite.h

const w = zoneById.workshop.startX

/**
 * Placed objects in path order. Zones 2-7 get their objects in Phases 3-5;
 * until then they are colour-block placeholders with a sign.
 */
export const placedObjects: PlacedObject[] = [
  {
    ref: refFor('workshop', 'cuet-signpost'),
    zone: 'workshop',
    x: w + 3 * TILE,
    y: onGround(signpostSprite),
    sprite: signpostSprite,
  },
  {
    ref: refFor('workshop', 'workbench'),
    zone: 'workshop',
    x: w + 10 * TILE,
    y: onGround(workbenchSprite),
    sprite: workbenchSprite,
  },
  {
    ref: refFor('workshop', 'soccer-bot'),
    zone: 'workshop',
    x: w + 26 * TILE,
    y: onGround(soccerBotSprite) - 2,
    sprite: soccerBotSprite,
    animate: 'tick',
  },
]

export const objectCenterX = (o: PlacedObject) => o.x + o.sprite.w / 2

export const AVATAR_START_X = w + 6 * TILE

/** Scenery geometry the terrain baker draws for the Workshop. */
export const workshopScenery = {
  leanTo: { x: 8 * TILE, w: 8 * TILE },
  pitch: { x: 20 * TILE, w: 15 * TILE },
}
