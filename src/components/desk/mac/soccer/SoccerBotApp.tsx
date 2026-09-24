'use client'
/**
 * Soccer Bot: build my 2022 robot from its real parts, drive it against a
 * keeper, then see the real one. Building is optional.
 */
import { useState } from 'react'
import { useDesk } from '../../DeskDataContext'
import { Builder } from './Builder'
import { Game } from './Game'
import { Story } from './Story'
import { PARTS, PartThumb, type PartId } from './parts'

type Screen = 'intro' | 'build' | 'play' | 'story'

export function SoccerBotApp() {
  const d = useDesk()
  const [screen, setScreen] = useState<Screen>('intro')
  const [built, setBuilt] = useState(false)
  const parts = d.projects.find((p) => p.id === 'soccer-bot')?.images.find((i) => i.id === 'robot-parts')

  if (screen === 'build')
    return (
      <Builder
        onDone={() => {
          setBuilt(true)
          setScreen('play')
        }}
        onSkip={() => setScreen('play')}
      />
    )
  if (screen === 'play') return <Game built={built} onStory={() => setScreen('story')} />
  if (screen === 'story') return <Story built={built} onPlay={() => setScreen('play')} onBuild={() => setScreen('build')} />

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_300px] bg-[#23392a] text-[#efe6d6] overflow-y-auto">
      <section className="flex flex-col justify-center gap-4 p-6 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">Soccer Bot · 2022</p>
        <h2 className="text-[30px] font-semibold leading-tight">Build my first robot, then play with it.</h2>
        <p className="max-w-[460px] text-[14px] leading-relaxed text-white/75">
          These are the parts I used. Follow the manual: mount the motors, wire the drivers, power it up, upload the
          code. Then take it to the pitch.
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="Parts">
          {(Object.keys(PARTS) as PartId[]).map((id) => (
            <li key={id} title={PARTS[id].name} className="rounded-lg bg-black/25 p-1">
              <PartThumb id={id} size={44} />
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          <button type="button" onClick={() => setScreen('build')} autoFocus className="rounded-lg bg-[#efe6d6] px-5 py-2 font-semibold text-black hover:bg-white">
            Build it · about 3 min
          </button>
          <button type="button" onClick={() => setScreen('play')} className="rounded-lg bg-white/10 px-5 py-2 font-medium hover:bg-white/15">
            Just play
          </button>
          <button type="button" onClick={() => setScreen('story')} className="rounded-lg px-3 py-2 text-white/60 hover:text-white">
            See the real one
          </button>
        </div>
      </section>
      {parts && (
        <figure className="hidden md:flex flex-col justify-center bg-black/25 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={parts.src} alt={parts.alt} className="max-h-[440px] w-full rounded-lg object-cover" />
          <figcaption className="mt-2 text-center text-[12px] text-white/55">{parts.caption}</figcaption>
        </figure>
      )}
    </div>
  )
}
