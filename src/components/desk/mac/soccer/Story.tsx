'use client'
/** After the match: the real robot, in the author's own photos. */
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDesk } from '../../DeskDataContext'

const ORDER = ['robot-parts', 'robot-bench', 'robot-versions', 'robot-team']

export function Story({ built, onPlay, onBuild }: { built: boolean; onPlay: () => void; onBuild: () => void }) {
  const d = useDesk()
  const bot = d.projects.find((p) => p.id === 'soccer-bot')
  const cert = d.certificates.find((c) => c.id === 'cuss-robo-soccer')
  const photos = [
    ...ORDER.map((id) => bot?.images.find((i) => i.id === id)).filter((x): x is NonNullable<typeof x> => !!x),
    ...(cert ? [{ id: cert.id, src: cert.src, alt: cert.alt, caption: cert.name }] : []),
  ]
  const [i, setI] = useState(0)
  const cur = photos[i]

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_320px] bg-[#1b1c1e] text-[#efe6d6] min-h-0">
      <figure className="relative flex min-h-[240px] flex-col items-center justify-center bg-black p-3">
        {cur && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={cur.id} src={cur.src} alt={cur.alt} className="max-h-full max-w-full min-h-0 flex-1 object-contain bb-fade" />
            <figcaption className="mt-2 text-center text-[13px] text-white/75">{cur.caption}</figcaption>
          </>
        )}
        {photos.length > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => setI((i - 1 + photos.length) % photos.length)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 hover:bg-white/25">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => setI((i + 1) % photos.length)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 hover:bg-white/25">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </figure>
      <section className="flex flex-col gap-3 overflow-y-auto p-5 mac-scroll">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">The real one · 2022</p>
        <h3 className="text-[22px] font-semibold leading-tight">{built ? 'You just built my first robot.' : 'The bot you just drove was real.'}</h3>
        <p className="text-[14px] leading-relaxed text-white/80">
          In 2022 my team and I built a remote-controlled soccer robot for the Robo Soccer event at Chittagong Science
          Carnival 2.0. Same parts as the ones in the tray: an Arduino Uno, two BTS7960 drivers, four DC motors, a 3S
          LiPo, buck converters and an HC-05, in a plywood body.
        </p>
        {bot?.role && <p className="text-[13px] text-white/60">My part: {bot.role.charAt(0).toLowerCase() + bot.role.slice(1)}.</p>}
        {cert && <p className="text-[13px] text-white/60">{cert.name}.</p>}
        <p className="text-[14px] leading-relaxed text-white/80">
          It was the start of everything else on this desk: motors and batteries first, then the code that drives them,
          then the machines that run code for other people.
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {photos.map((p, n) => (
            <span key={p.id} className={`h-1.5 flex-1 rounded-full ${n === i ? 'bg-[#efe6d6]' : 'bg-white/15'}`} />
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <button type="button" onClick={onPlay} className="rounded-lg bg-[#efe6d6] py-2 font-semibold text-black hover:bg-white">
            Back to the pitch
          </button>
          <button type="button" onClick={onBuild} className="rounded-lg bg-white/10 py-2 font-medium hover:bg-white/15">
            {built ? 'Build it again' : 'Build it yourself'}
          </button>
        </div>
      </section>
    </div>
  )
}
