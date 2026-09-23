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
import { mazePathSprite, mazeSprite, teamDoorSprite, terminalSprite } from './sprites/dungeon'
import {
  laptopChatSprite,
  laptopCodeSprite,
  pitchBoardSprite,
  stickyWallSprite,
  trophySprite,
} from './sprites/garage'

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
  /** Drawn over the sprite only while the object is hovered, focused or near (maze path). */
  overlay?: Sprite
}

const zoneSpec: { id: ZoneId; widthTiles: number; keyColor: string; built: boolean }[] = [
  { id: 'workshop', widthTiles: 40, keyColor: 'var(--zone-workshop)', built: true },
  { id: 'dungeon', widthTiles: 40, keyColor: 'var(--zone-dungeon)', built: true },
  { id: 'garage', widthTiles: 40, keyColor: 'var(--zone-garage)', built: true },
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
const d = zoneById.dungeon.startX
const g = zoneById.garage.startX

type Placement = Omit<PlacedObject, 'ref' | 'zone' | 'y'> & { y?: number; objectId: string }

const place = (zone: ZoneId, items: Placement[]): PlacedObject[] =>
  items.map(({ objectId, y, ...rest }) => ({
    ...rest,
    ref: refFor(zone, objectId),
    zone,
    y: y ?? onGround(rest.sprite),
  }))

/** Top of the Garage trophy shelf (source px). */
export const GARAGE_SHELF_Y = 104

/**
 * Placed objects in path order. Zones 4-7 get their objects in Phases 4-5;
 * until then they are colour-block placeholders with a sign.
 */
export const placedObjects: PlacedObject[] = [
  ...place('workshop', [
    { objectId: 'cuet-signpost', x: w + 3 * TILE, sprite: signpostSprite },
    { objectId: 'workbench', x: w + 10 * TILE, sprite: workbenchSprite },
    {
      objectId: 'soccer-bot',
      x: w + 26 * TILE,
      y: onGround(soccerBotSprite) - 2,
      sprite: soccerBotSprite,
      animate: 'tick',
    },
  ]),
  ...place('dungeon', [
    { objectId: 'terminal', x: d + 6 * TILE, sprite: terminalSprite },
    // The maze is a floor mosaic in front of the walk line.
    { objectId: 'maze', x: d + 13 * TILE, y: GROUND_Y + 3, sprite: mazeSprite, overlay: mazePathSprite },
    { objectId: 'team-door', x: d + 25 * TILE, sprite: teamDoorSprite },
  ]),
  ...place('garage', [
    { objectId: 'trophy-monolith', x: g + 6 * TILE, y: GARAGE_SHELF_Y - trophySprite.h, sprite: trophySprite },
    { objectId: 'laptop-api-avenger', x: g + 11 * TILE, sprite: laptopCodeSprite },
    { objectId: 'laptop-bs23', x: g + 16 * TILE, sprite: laptopChatSprite },
    { objectId: 'pitch-board', x: g + 22 * TILE, sprite: pitchBoardSprite },
    { objectId: 'sticky-wall', x: g + 28 * TILE, y: 70, sprite: stickyWallSprite },
  ]),
]

export const objectCenterX = (o: PlacedObject) => o.x + o.sprite.w / 2

export const AVATAR_START_X = w + 6 * TILE

/** Scenery geometry the terrain baker draws (zone-relative source px). */
export const workshopScenery = {
  leanTo: { x: 8 * TILE, w: 8 * TILE },
  pitch: { x: 20 * TILE, w: 15 * TILE },
}

export const dungeonScenery = {
  wallTop: 40,
  gates: [22 * TILE, 28 * TILE], // the two plain gates either side of the team door
  screens: [11 * TILE, 34 * TILE],
  windows: [3 * TILE, 18 * TILE, 31 * TILE],
  pillars: [0, 10 * TILE, 20 * TILE, 38 * TILE],
}

export const garageScenery = {
  roofY: 44,
  shelf: { x: 4 * TILE, w: 5 * TILE },
  windows: [9 * TILE, 18 * TILE, 33 * TILE],
  lamps: [13 * TILE, 24 * TILE],
  crates: 34 * TILE,
}
