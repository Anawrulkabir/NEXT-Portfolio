#!/usr/bin/env tsx
/**
 * Writes src/app/icon.svg — the 32×32 favicon (§13.2): the avatar's head
 * (Workshop outfit, goggles up) on a moss tile, from the same pixel grid the
 * world uses. Re-run after changing the avatar: npx tsx scripts/make-icon.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { gridToRuns } from '../src/world/pixel'
import { avatarOutfits } from '../src/world/sprites/avatar'

const sprite = avatarOutfits.workshop
const head = sprite.frames[0].slice(0, 10) // 18×10 head rows
const runs = gridToRuns(head, sprite.palette)
// Centre the 18×10 head in a 24×24 tile, rendered at 32×32.
const ox = 3
const oy = 8
const rects = runs.map((r) => `<rect x="${r.x + ox}" y="${r.y + oy}" width="${r.w}" height="1" fill="${r.fill}"/>`).join('')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" shape-rendering="crispEdges"><rect width="24" height="24" fill="#2f4a34"/><rect y="18" width="24" height="6" fill="#4f7a4a"/>${rects}</svg>\n`
fs.writeFileSync(path.join(__dirname, '..', 'src', 'app', 'icon.svg'), svg)
console.log('wrote src/app/icon.svg')
