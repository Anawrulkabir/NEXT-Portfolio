/** Camera — follows the avatar with a centred dead-zone, clamped to the world (§05.1). */
import { AVATAR_W, DEAD_ZONE } from '../constants'

export function desiredCameraX(
  avatarX: number,
  currentCamX: number,
  viewportW: number,
  worldW: number
) {
  const center = avatarX + AVATAR_W / 2
  const half = (viewportW * DEAD_ZONE) / 2
  const left = currentCamX + viewportW / 2 - half
  const right = currentCamX + viewportW / 2 + half
  let cam = currentCamX
  if (center < left) cam = center - viewportW / 2 + half
  else if (center > right) cam = center - viewportW / 2 - half
  return clampCamera(cam, viewportW, worldW)
}

export function clampCamera(cam: number, viewportW: number, worldW: number) {
  return Math.max(0, Math.min(cam, Math.max(0, worldW - viewportW)))
}

/** Camera centred on a world x — used for jumps (route strip, deep links, focus). */
export function centeredCameraX(x: number, viewportW: number, worldW: number) {
  return clampCamera(x - viewportW / 2, viewportW, worldW)
}
