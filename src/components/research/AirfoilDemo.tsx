'use client'
import { useId, useState } from 'react'
import { ANGLES, FRAMES, H, OOD_THRESHOLD, W } from './airfoil'

/**
 * Airfoil illustration (§09 I-10): drag the angle of attack past the
 * (illustrative) training range and a "LoRA patch" chip snaps on — the
 * thesis idea of adapting a trained solver to unseen conditions without full
 * retraining. Labelled as an illustration; it shows no results.
 */
export function AirfoilDemo() {
  const [deg, setDeg] = useState(4)
  const id = useId()
  const f = FRAMES[deg]
  const ood = deg > OOD_THRESHOLD

  return (
    <figure className="space-y-3">
      <div className="relative border-2 border-loam bg-[#16202a]">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" shapeRendering="crispEdges" aria-hidden="true">
          <rect x={0} y={0} width={W} height={1} fill="#4f575c" />
          <rect x={0} y={H - 1} width={W} height={1} fill="#4f575c" />
          {f.lines.map((line, i) => (
            <g key={i} fill={line.separated ? '#c9663a' : '#6fb7b9'}>
              {line.pts.map(([x, y]) => (
                <rect key={x} x={x} y={y} width={1} height={1} />
              ))}
            </g>
          ))}
          <g fill="#e7e1d1">
            {f.airfoil.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
            ))}
          </g>
        </svg>
        <span
          className={`absolute left-2 top-2 text-[11px] font-semibold px-1.5 py-0.5 ${
            ood ? 'bg-ember text-ink' : 'bg-signal text-ink'
          }`}
        >
          {ood ? 'Out of distribution' : 'Training range'}
        </span>
        {ood && (
          <span className="lora-chip absolute right-2 top-2 text-[11px] font-semibold px-1.5 py-0.5 bg-parchment text-ink border-2 border-moss">
            LoRA patch
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor={id} className="text-sm font-semibold whitespace-nowrap">
          Angle of attack
        </label>
        <input
          id={id}
          type="range"
          min={ANGLES[0]}
          max={ANGLES[ANGLES.length - 1]}
          step={2}
          value={deg}
          onChange={(e) => setDeg(Number(e.target.value))}
          aria-valuetext={`${deg} degrees, ${ood ? 'out of distribution' : 'training range'}`}
          className="flex-1 accent-[#375c34] pixel-focus"
        />
        <span className="text-sm tabular-nums w-8 text-right" aria-hidden="true">
          {deg}°
        </span>
      </div>
      <figcaption className="text-xs leading-relaxed">
        Illustration, not results: the threshold and flow lines are drawn to explain the idea. A solver trained on a range
        of conditions is adapted to high-incidence flow outside that range with a small LoRA-style update instead of full
        retraining.
      </figcaption>
    </figure>
  )
}
