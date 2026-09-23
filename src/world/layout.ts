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
import { deskDualSprite, monitorDeskSprite, toolboxRedSprite, toolboxSteelSprite, whiteboardSprite } from './sprites/software'
import {
  cloudGateSprite,
  consoleSprite,
  conveyorSprite,
  crateSprite,
  gpuRackSprite,
  opsDeskSprite,
  podSprite,
  reactorSprite,
} from './sprites/datacenter'
import {
  archiveDoorSprite,
  chalkboardSprite,
  dataLoggerSprite,
  interestsBoardSprite,
  officeDoorSprite,
  pheRigCoolSprite,
  pheRigWarmSprite,
  windTunnelSprite,
  workstationSprite,
} from './sprites/labs'

export type ZoneLayout = {
  id: ZoneId
  chapter: JourneyChapter
  widthTiles: number
  startX: number // source px
  endX: number // source px
  keyColor: string // CSS var for the route strip waypoint
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

const zoneSpec: { id: ZoneId; widthTiles: number; keyColor: string }[] = [
  { id: 'workshop', widthTiles: 40, keyColor: 'var(--zone-workshop)' },
  { id: 'dungeon', widthTiles: 40, keyColor: 'var(--zone-dungeon)' },
  { id: 'garage', widthTiles: 40, keyColor: 'var(--zone-garage)' },
  { id: 'software', widthTiles: 40, keyColor: 'var(--zone-software)' },
  { id: 'datacenter', widthTiles: 40, keyColor: 'var(--zone-datacenter)' },
  { id: 'physics-lab', widthTiles: 40, keyColor: 'var(--zone-physics-lab)' },
  { id: 'thermal-lab', widthTiles: 40, keyColor: 'var(--zone-thermal-lab)' },
  { id: 'overlook', widthTiles: 24, keyColor: 'var(--moss)' },
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
const sw = zoneById.software.startX
const dc = zoneById.datacenter.startX
const pl = zoneById['physics-lab'].startX
const tl = zoneById['thermal-lab'].startX
const ov = zoneById.overlook.startX

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

/** Placed objects in path order. */
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
  ...place('software', [
    { objectId: 'desk-internship', x: sw + 4 * TILE, sprite: deskDualSprite },
    { objectId: 'whiteboard-api', x: sw + 11 * TILE, y: 66, sprite: whiteboardSprite },
    { objectId: 'monitor-frontend', x: sw + 19 * TILE, sprite: monitorDeskSprite },
    { objectId: 'toolbox-software', x: sw + 28 * TILE, sprite: toolboxRedSprite },
  ]),
  ...place('datacenter', [
    { objectId: 'ops-desk', x: dc + 5 * TILE, sprite: opsDeskSprite },
    { objectId: 'tensor-reactor', x: dc + 8 * TILE, sprite: reactorSprite },
    { objectId: 'gpu-rack', x: dc + 11 * TILE, sprite: gpuRackSprite },
    { objectId: 'container-crate', x: dc + 15 * TILE, sprite: crateSprite },
    { objectId: 'k8s-console', x: dc + 19 * TILE, sprite: consoleSprite },
    { objectId: 'workflow-conveyor', x: dc + 23 * TILE, sprite: conveyorSprite },
    { objectId: 'workspace-pod', x: dc + 27.5 * TILE, sprite: podSprite },
    { objectId: 'cloud-gate', x: dc + 32 * TILE, sprite: cloudGateSprite },
    { objectId: 'toolbox-infra', x: dc + 36.5 * TILE, sprite: toolboxSteelSprite },
  ]),
  ...place('physics-lab', [
    { objectId: 'wind-tunnel', x: pl + 5 * TILE, sprite: windTunnelSprite },
    { objectId: 'chalkboard', x: pl + 14 * TILE, y: 64, sprite: chalkboardSprite },
    { objectId: 'workstation-physics', x: pl + 20 * TILE, sprite: workstationSprite },
  ]),
  ...place('thermal-lab', [
    { objectId: 'phe-rig-r455a', x: tl + 5 * TILE, sprite: pheRigCoolSprite },
    { objectId: 'data-logger', x: tl + 10 * TILE, sprite: dataLoggerSprite },
    { objectId: 'phe-rig-r1336', x: tl + 15 * TILE, sprite: pheRigWarmSprite },
    { objectId: 'interests-board', x: tl + 29 * TILE, y: 66, sprite: interestsBoardSprite },
  ]),
  ...place('overlook', [
    { objectId: 'door-archive', x: ov + 18 * TILE, sprite: archiveDoorSprite },
    { objectId: 'door-contact', x: ov + 20.5 * TILE, sprite: officeDoorSprite },
  ]),
]

/**
 * The Data Center's guided pipeline, in data-flow order (§05.2 Zone 5). A
 * cable joins them; opening one sends a light packet from the GPU to it (I-08).
 */
export const PIPELINE = [
  'gpu-rack',
  'container-crate',
  'k8s-console',
  'workflow-conveyor',
  'workspace-pod',
  'cloud-gate',
] as const
export const CABLE_Y = GROUND_Y - 3

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

export const softwareScenery = {
  ceilingY: 44,
  windows: [2 * TILE, 16 * TILE, 23 * TILE, 31 * TILE],
  lights: [7 * TILE, 20 * TILE, 30 * TILE],
  coffee: 25 * TILE,
  serverDoor: 35 * TILE,
}

export const datacenterScenery = {
  ceilingY: 36,
  rackStep: 26,
  airlock: 38 * TILE,
}

/** Rack LEDs that blink (§08.6: 1-2 Hz, ~3% of pixels) — zone-relative source px. */
export const datacenterLeds: { x: number; y: number; color: string; delay: number }[] = (() => {
  const leds: { x: number; y: number; color: string; delay: number }[] = []
  let seed = 41
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 2 ** 32
  }
  for (let x = 4; x < 36 * TILE; x += datacenterScenery.rackStep) {
    for (let i = 0; i < 3; i++) {
      leds.push({
        x: x + 3 + Math.floor(rand() * 14),
        y: 62 + Math.floor(rand() * 9) * 6,
        color: rand() < 0.8 ? '#6fb7b9' : '#e0a23c',
        delay: Math.round(rand() * 1600),
      })
    }
  }
  return leds
})()

export const physicsScenery = {
  windows: [2 * TILE, 11 * TILE, 18 * TILE],
  benches: [24 * TILE],
  corridor: 28 * TILE,
}

export const thermalScenery = {
  cylinders: 20.5 * TILE,
  plotsDesk: 24 * TILE,
  backDoor: 36 * TILE,
}

export const overlookScenery = {
  roofAccess: 0,
  shed: { x: 17 * TILE, w: 6 * TILE },
  panelX: 3 * TILE, // in-scene destination panel (I-15)
}

export const garageScenery = {
  roofY: 44,
  shelf: { x: 4 * TILE, w: 5 * TILE },
  windows: [9 * TILE, 18 * TILE, 33 * TILE],
  lamps: [13 * TILE, 24 * TILE],
  crates: 34 * TILE,
}
