'use client'
/**
 * Notes: where the stories live. Short, first-person, specific. Every fact
 * comes from the content layer (via DeskData); the framing sentences only
 * restate those facts in plain words.
 */
import { useState, type ReactNode } from 'react'
import { ChevronLeft, Search, SquarePen } from 'lucide-react'
import { useDesk } from '../DeskDataContext'
import type { DeskData } from '../data'
import { useOS, type AppId } from './context'

type Note = { id: string; title: string; when: string; preview: string; body: ReactNode }

const hostOf = (href: string) => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#b3261e] underline decoration-[#b3261e]/40 underline-offset-2 hover:decoration-[#b3261e]">
      {children}
    </a>
  )
}

function buildNotes(d: DeskData, go: (id: string) => void, open: (id: AppId, arg?: string) => void, touch: boolean): Note[] {
  const Go = ({ id, children }: { id: string; children: ReactNode }) => (
    <button type="button" onClick={() => go(id)} className="inline text-[#b3261e] underline decoration-[#b3261e]/40 underline-offset-2 hover:decoration-[#b3261e] text-left">
      {children}
    </button>
  )
  const App = ({ id, arg, children }: { id: AppId; arg?: string; children: ReactNode }) => (
    <button type="button" onClick={() => open(id, arg)} className="inline-flex items-center gap-1 rounded-md bg-black/[0.06] px-2 py-0.5 text-[13px] font-medium hover:bg-black/10">
      {children}
    </button>
  )
  const poridhi = d.experience.find((x) => x.id === 'poridhi')
  const junior = poridhi?.roles.find((r) => r.id === 'junior-software-engineer')
  const intern = poridhi?.roles.find((r) => r.id !== 'junior-software-engineer')
  const studio = junior?.groups.find((g) => g.product === 'AI Studio')
  const tensor = junior?.groups.find((g) => g.product === 'TensorCode')
  const thesis = d.research.find((r) => r.id === 'pinn-naca0012-thesis')
  const refrigerant = d.research.filter((r) => r.id !== 'pinn-naca0012-thesis')
  const hack = d.projects.filter((p) => p.shelf === 'hackathon')
  const bot = d.projects.find((p) => p.id === 'soccer-bot')
  const botCert = d.certificates.find((c) => c.id === 'cuss-robo-soccer')
  const web = d.projects.filter((p) => p.shelf === 'early-web')

  const notes: Note[] = [
    {
      id: 'read-me',
      title: 'Read me first',
      when: 'Pinned',
      preview: `Hi, I'm Fahad. I study mechanical engineering…`,
      body: (
        <>
          <h1>Hi, I&rsquo;m Fahad.</h1>
          <p>
            I study mechanical engineering at CUET in {d.profile.location}, and I work on GPU infrastructure at
            Poridhi.io.
          </p>
          <p>
            This is my actual desk: the HP monitor, my MacBook Air, the Royal Kludge R65 with the green and red keys,
            the Rapoo mouse, the money plant in its bottle. Everything on this screen works. Press a key and watch the
            keyboard on the desk.
          </p>
          <h2>Start here</h2>
          <ul>
            <li>
              <Go id="gpu">Cutting GPU launch time from 15 minutes to 5</Go>
            </li>
            <li>
              <Go id="thesis">My thesis, in plain words</Go>
            </li>
            <li>
              <Go id="robot">Where it started: a soccer robot</Go>
            </li>
            <li>
              <Go id="contact">Get in touch</Go>
            </li>
          </ul>
          <p className="flex flex-wrap gap-2 pt-1">
            <App id="gpu">Try GPU Slices</App>
            {!touch && <App id="soccer">Play Soccer Bot</App>}
            <App id="preview">Open my résumé</App>
          </p>
        </>
      ),
    },
    {
      id: 'gpu',
      title: 'Cutting GPU launch time from 15 minutes to 5',
      when: 'AI Studio · 2025–now',
      preview: 'Starting a GPU session on AI Studio used to take 10–15 minutes…',
      body: (
        <>
          <h1>Cutting GPU launch time from 15 minutes to 5</h1>
          <p>
            Starting a GPU session on <Ext href="https://ai.poridhi.io">AI Studio</Ext> used to take 10–15 minutes. Now
            it takes 3–5.
          </p>
          <h2>What changed</h2>
          <p>
            I set up the platform&rsquo;s first stack on AWS: g4dn instances with custom AMIs, TensorFlow images in
            ECR, and sessions saved to S3 through JuiceFS. Later, with the team, we moved it to a bare-metal Kubernetes
            cluster.
          </p>
          <p>
            The key piece is HAMi. It splits each RTX 4090 into six 8 GB slices with hard isolation, which
            Kubernetes&rsquo; built-in time-slicing couldn&rsquo;t give us. Sessions share a card without touching each
            other&rsquo;s memory.
          </p>
          {studio && (
            <>
              <h2>The parts I did</h2>
              <ul>
                {studio.bullets.slice(2).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </>
          )}
          <p className="pt-1">
            <App id="gpu">Open GPU Slices to play with it</App>
          </p>
        </>
      ),
    },
    {
      id: 'tensorcode',
      title: 'TensorCode: a GPU IDE in a browser tab',
      when: 'Poridhi.io · 2025',
      preview: 'Run PyTorch and CUDA from a browser tab. I built the backend…',
      body: (
        <>
          <h1>TensorCode</h1>
          <p>
            <Ext href="https://tensorcode.poridhi.io">TensorCode</Ext> runs PyTorch and CUDA code from a browser tab.
          </p>
          {tensor && (
            <ul>
              {tensor.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {intern && (
            <>
              <h2>Before that: the internship ({intern.dates})</h2>
              <ul>
                {intern.groups.flatMap((g) => g.bullets).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </>
          )}
        </>
      ),
    },
    {
      id: 'thesis',
      title: 'My thesis, in plain words',
      when: thesis?.status ?? 'Thesis',
      preview: 'A neural network that has to obey the equations of fluid flow…',
      body: (
        <>
          <h1>My thesis, in plain words</h1>
          <p>
            A physics-informed neural network (PINN) learns a flow field while also being made to obey the equations
            of fluid flow. Mine predicts the flow around a NACA 0012 airfoil, the classic symmetric wing section.
          </p>
          <p>
            The hard part is steep angles of attack, where the flow behaves differently from what the network was
            trained on. Instead of retraining the whole network, I adapt it with LoRA-style fine-tuning: a small set of
            extra weights, trained on the new conditions.
          </p>
          {thesis?.supervisor && <p className="meta">Supervisor: {thesis.supervisor}</p>}
          {thesis?.title && thesis.title !== thesis.shortTitle && <p className="meta">Full title: {thesis.title}</p>}
          <p className="pt-1">
            <a href={`/research/${thesis?.id ?? ''}`} target="_blank" className="text-[#b3261e] underline underline-offset-2">
              The longer write-up ↗
            </a>
          </p>
        </>
      ),
    },
    {
      id: 'refrigerants',
      title: 'Refrigerants and small data',
      when: 'Research',
      preview: 'Machine learning for heat transfer in low-GWP refrigerants…',
      body: (
        <>
          <h1>Refrigerants and small data</h1>
          <p>
            This work runs on small experimental datasets. With so little data, how the features are built and how the
            models are checked matters as much as the model itself.
          </p>
          {refrigerant.map((r) => (
            <div key={r.id}>
              <h2>{r.shortTitle}</h2>
              <p className="meta">{r.status}</p>
              <p>{r.oneLine}</p>
            </div>
          ))}
        </>
      ),
    },
    {
      id: 'hackathons',
      title: 'Hackathons',
      when: '2025',
      preview: hack.map((h) => h.title).join(' · '),
      body: (
        <>
          <h1>Hackathons</h1>
          {hack.map((h) => (
            <div key={h.id}>
              <h2>{h.title}</h2>
              {h.result && <p className="meta">{h.result}</p>}
              <p>{h.oneLine}</p>
              {h.stack.length > 0 && <p className="meta">{h.stack.join(' · ')}</p>}
            </div>
          ))}
        </>
      ),
    },
    {
      id: 'robot',
      title: 'Where it started: a soccer robot',
      when: '2022',
      preview: bot?.oneLine ?? 'A remote-controlled robot, 2022.',
      body: (
        <>
          <h1>Where it started: a soccer robot</h1>
          {bot && <p>{bot.oneLine}</p>}
          {bot?.role && <p className="meta">{bot.role}</p>}
          {botCert && (
            <button type="button" onClick={() => open('photos', botCert.id)} className="block w-full mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={botCert.src} alt={botCert.alt} className="w-full rounded-lg border border-black/10" />
              <span className="meta block mt-1.5 text-left">{botCert.name}</span>
            </button>
          )}
          {!touch && (
            <p className="pt-2">
              <App id="soccer">Drive one yourself</App>
            </p>
          )}
        </>
      ),
    },
    {
      id: 'competitive',
      title: 'Competitive programming',
      when: '2022–23',
      preview: 'ICPC preliminaries in 2022 and 2023. 300+ problems…',
      body: (
        <>
          <h1>Competitive programming</h1>
          <ul>
            <li>ICPC preliminaries, 2022 and 2023.</li>
            <li>CUET IUPC, 2022–2023.</li>
            <li>ASRRO Robocoder programming contest, CUET, 2022.</li>
            <li>300+ problems solved across 50+ contests.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'early-web',
      title: 'My first websites',
      when: 'Before 2025',
      preview: web.map((w) => w.title).join(' · '),
      body: (
        <>
          <h1>My first websites</h1>
          {web.map((w) => (
            <div key={w.id}>
              <h2>{w.title}</h2>
              <p>{w.oneLine}</p>
              {w.images.slice(0, 1).map((im) => (
                <button key={im.id} type="button" onClick={() => open('photos', im.id)} className="block w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.src} alt={im.alt} className="w-full rounded-lg border border-black/10" />
                </button>
              ))}
              {w.links.length > 0 && (
                <p className="meta">
                  {w.links.map((l) => (
                    <span key={l.href} className="mr-3">
                      <Ext href={l.href}>{l.label}</Ext>
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}
        </>
      ),
    },
    {
      id: 'certificates',
      title: 'Certificates',
      when: `${d.certificates.length} scans`,
      preview: d.certificates.map((c) => c.name).join(' · '),
      body: (
        <>
          <h1>Certificates</h1>
          <div className="grid grid-cols-2 gap-3">
            {d.certificates.map((c) => (
              <button key={c.id} type="button" onClick={() => open('photos', c.id)} className="text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.alt} className="w-full aspect-[4/3] object-cover rounded-lg border border-black/10" />
                <span className="meta block mt-1 leading-snug">{c.name}</span>
              </button>
            ))}
          </div>
        </>
      ),
    },
    {
      id: 'contact',
      title: 'Get in touch',
      when: 'Always',
      preview: d.profile.email,
      body: <ContactBody d={d} open={open} />,
    },
  ]
  return notes
}

function ContactBody({ d, open }: { d: DeskData; open: (id: AppId) => void }) {
  const [copied, setCopied] = useState(false)
  return (
    <>
      <h1>Get in touch</h1>
      <p>Email is the fastest way to reach me.</p>
      <p className="flex items-center gap-2 flex-wrap">
        <a href={`mailto:${d.profile.email}`} className="text-[#b3261e] underline underline-offset-2">
          {d.profile.email}
        </a>
        <button
          type="button"
          className="rounded-md bg-black/[0.06] px-2 py-0.5 text-[13px] font-medium hover:bg-black/10"
          onClick={() =>
            navigator.clipboard?.writeText(d.profile.email).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            })
          }
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button type="button" className="rounded-md bg-black/[0.06] px-2 py-0.5 text-[13px] font-medium hover:bg-black/10" onClick={() => open('mail')}>
          Write in Mail
        </button>
      </p>
      <ul>
        {d.profile.links.map((l) => (
          <li key={l.href}>
            {l.label}: <Ext href={l.href}>{hostOf(l.href)}</Ext>
          </li>
        ))}
      </ul>
      <p className="meta">{d.profile.location}</p>
    </>
  )
}

export function NotesApp({ selected, onSelect, compact = false }: { selected: string; onSelect: (id: string) => void; compact?: boolean }) {
  const d = useDesk()
  const { open } = useOS()
  const [q, setQ] = useState('')
  const [showList, setShowList] = useState(true)
  const go = (id: string) => {
    onSelect(id)
    setShowList(false)
  }
  const notes = buildNotes(d, go, open, compact)
  const shown = q ? notes.filter((n) => (n.title + n.preview).toLowerCase().includes(q.toLowerCase())) : notes
  const note = notes.find((n) => n.id === selected) ?? notes[0]

  const list = (
    <div className={`${compact ? 'flex-1' : 'w-[260px] border-r border-black/10'} flex flex-col bg-[#f6f4ef] min-h-0`}>
      <div className="p-2.5">
        <label className="flex items-center gap-1.5 rounded-md bg-black/[0.06] px-2 py-1 text-[13px] text-black/50">
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search notes" className="bg-transparent outline-none flex-1 text-black" />
        </label>
      </div>
      <ul className="flex-1 overflow-y-auto px-2 pb-2 mac-scroll">
        {shown.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => go(n.id)}
              className={`w-full text-left rounded-lg px-3 py-2 ${!compact && n.id === note.id ? 'bg-[#f2c14e]/70' : 'hover:bg-black/[0.04]'}`}
            >
              <span className="block text-[13.5px] font-semibold truncate">{n.title}</span>
              <span className="block text-[12px] text-black/55 truncate">
                <span className="text-black/70 mr-1.5">{n.when}</span>
                {n.preview}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  const body = (
    <article className="notes-body flex-1 overflow-y-auto mac-scroll bg-[#fffdf8] px-8 py-6 min-w-0">
      {compact && (
        <button type="button" onClick={() => setShowList(true)} className="mb-3 -ml-2 flex items-center text-[15px] text-[#b3261e]">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Notes
        </button>
      )}
      <p className="text-center text-[11px] text-black/40 mb-3">{note.when}</p>
      {note.body}
    </article>
  )

  if (compact) return <div className="h-full flex flex-col">{showList ? list : body}</div>

  return (
    <div className="h-full flex">
      <div className="w-[170px] bg-[#ebe8e1] border-r border-black/10 pt-2 px-2 text-[13px]">
        <p className="px-2 pb-1 text-[11px] font-semibold text-black/40">fahad&rsquo;s notes</p>
        <p className="flex items-center justify-between rounded-md bg-black/[0.08] px-2 py-1 font-medium">
          All notes <span className="text-black/45">{notes.length}</span>
        </p>
        <button type="button" className="mt-3 flex items-center gap-1.5 px-2 text-black/40 cursor-not-allowed" title="Read-only today" disabled>
          <SquarePen className="h-3.5 w-3.5" aria-hidden="true" /> New note
        </button>
      </div>
      {list}
      {body}
    </div>
  )
}
