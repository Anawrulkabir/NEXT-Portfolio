import { gridToRuns, type Run, type Sprite } from '@/world/pixel'

const runCache = new WeakMap<Sprite, Run[][]>()
function runsFor(sprite: Sprite): Run[][] {
  let runs = runCache.get(sprite)
  if (!runs) {
    runs = sprite.frames.map((g) => gridToRuns(g, sprite.palette))
    runCache.set(sprite, runs)
  }
  return runs
}

/**
 * Renders a palette-grid sprite as crisp SVG at an integer scale. Every frame
 * is emitted as <g data-f="n">; CSS (.px-anim / .px-tick) picks the visible
 * one, so animation never re-renders React.
 */
export function PixelSprite({
  sprite,
  scale,
  frame,
  className,
}: {
  sprite: Sprite
  scale: number
  frame?: number // render only this frame
  className?: string
}) {
  const runs = runsFor(sprite)
  return (
    <svg
      width={sprite.w * scale}
      height={sprite.h * scale}
      viewBox={`0 0 ${sprite.w} ${sprite.h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {runs.map((frameRuns, i) =>
        frame !== undefined && frame !== i ? null : (
          <g key={i} data-f={i}>
            {frameRuns.map((r, j) => (
              <rect key={j} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
            ))}
          </g>
        )
      )}
    </svg>
  )
}
